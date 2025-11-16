"use client";
import { formatarData, obterEnderecoCompleto } from "@/app/util";
import { useParams, useRouter } from "next/navigation";
import { useEventosAtivosStore } from "@/stores/eventosAtivosStore";
import { FaStore, FaClock, FaCertificate, FaArrowLeft } from "react-icons/fa";
import Button from "@/components/UI/Button";
import { useEffect, useMemo, useState } from "react";
import { Loja } from "@/types/loja";
import { http } from "@/api/http";
import { endpoints } from "@/api/endpoints";
import StepDadosPessoais from "@/components/Inscricao/StepDadosPessoais";
import StepPreferencias from "@/components/Inscricao/StepPreferencias";
import StepEstiloJogo from "@/components/Inscricao/StepEstiloJogo";
import StepEstiloJogo2 from "@/components/Inscricao/StepEstiloJogo2";
import StepUniverso1 from "@/components/Inscricao/StepUniverso1";
import StepUniverso2 from "@/components/Inscricao/StepUniverso2";
import Footer from "@/components/Footer";
import {
  usePerfilUsuarioStore,
  type PerfilUsuario,
} from "@/stores/perfilUsuarioStore";
import { MECANICAS_LIST } from "@/enums/mecanicas";
import { CATEGORIAS_LIST } from "@/enums/categorias";
import { TEMAS_LIST } from "@/enums/temas";
import { cadastrarParticipante } from "@/api/participante";
import { getEventoById } from "@/api/evento";
import type { Evento } from "@/types/evento";
import Input from "@/components/UI/Input";

const toNumber = (value?: string | number) => {
  if (typeof value === "number") return value;
  const parsed = Number(value ?? 0);
  return Number.isNaN(parsed) ? 0 : parsed;
};

const TEMPO_JOGO_MEDIA: Record<string, number> = {
  "1": 15,
  "2": 35,
  "3": 55,
  "4": 75,
};

const tempoJogoValue = (value?: string) => {
  if (!value) return 0;
  return TEMPO_JOGO_MEDIA[value] ?? toNumber(value);
};

type ItemLookup = { id: number; descricao: string };

const createLookup = (list: ItemLookup[]) =>
  list.reduce<Record<string, ItemLookup>>((acc, item) => {
    acc[item.descricao] = { id: item.id, descricao: item.descricao };
    return acc;
  }, {});

const MECANICA_LOOKUP = createLookup(MECANICAS_LIST);
const CATEGORIA_LOOKUP = createLookup(CATEGORIAS_LIST);
const TEMA_LOOKUP = createLookup(TEMAS_LIST);

type Associacao = {
  mecanicas?: string[];
  categorias?: string[];
  temas?: string[];
};

const ASSOCIACOES_OPCOES: Record<string, Record<string, Associacao>> = {
  prefereSorteOuEstrategia: {
    sorte: {
      mecanicas: ["Rolagem de Dados", "Force sua sorte", "Apostas e Blefes"],
      categorias: ["Jogo de Dados"],
    },
    estrategia: {
      mecanicas: [
        "Gerenciamento de Mãos",
        "Alocação de Trabalhadores",
        "Pontos de Ação",
      ],
      categorias: ["Estratégia Abstrata"],
    },
  },
  prefereCompetirOuCooperar: {
    competir: {
      mecanicas: [
        "Eliminação de Jogadores",
        "Toma Essa",
        "Influência / Maioria na Área",
      ],
      categorias: ["Jogo de Guerra", "Miniaturas"],
    },
    cooperar: {
      mecanicas: ["Cooperativo", "Jogo em Equipe", "Semi-Cooperativo"],
      categorias: ["Jogo Festivo", "Destreza"],
    },
  },
  prefereRitmoJogo: {
    rapidos: {
      mecanicas: ["Tempo Real", "Toma Essa", "Force sua sorte"],
      categorias: ["Jogo Festivo", "Jogo de Entrada"],
    },
    longos: {
      mecanicas: [
        "Alocação de Trabalhadores",
        "Pontos de Ação",
        "Seleção de Ação",
      ],
      categorias: ["Estratégia Abstrata"],
    },
  },
};

const ASSOCIACOES_SIM: Record<string, Associacao> = {
  curteNegociar: {
    mecanicas: ["Negociação", "Leilão / Lances", "Apostas e Blefes"],
    categorias: ["Jogo de Cartas", "Colecionável"],
  },
  gostaDeCriar: {
    mecanicas: [
      "Papel e Caneta",
      "Construção a partir de Modelo",
      "Colocação de Peças",
    ],
    categorias: ["Quebra-Cabeça", "Imprima e Jogue"],
  },
  gostaDeDesafiosFisicos: {
    mecanicas: [
      "Atuação/Mímica",
      "Destreza",
      "Empilhar e Equilibrar",
      "Cantar",
      "Batata Quente",
    ],
    categorias: ["Jogo Festivo", "Destreza"],
  },
  gostaDeMagia: {
    categorias: ["Dungeon Crawler", "Livro-jogo"],
    temas: ["Fantasia", "Medieval", "Mitologia"],
  },
  prefereUniversoTecnologico: {
    categorias: ["Integrado com Aplicativo"],
    temas: ["Ficção Científica"],
  },
  curteAdministracao: {
    categorias: ["Jogo de Cartas", "Colecionável"],
    temas: ["Economia / Produção"],
  },
  prefereJogosEngracados: {
    categorias: ["Jogo Festivo"],
    temas: ["Humor", "Cultura Pop ou Geek"],
  },
  gostaDeBatalhas: {
    categorias: ["Jogo de Guerra", "Miniaturas"],
    temas: ["Guerra", "Luta / Artes Marciais"],
  },
};

type TemaPayload = { id: number; nmTema: string };
type CategoriaPayload = { id: number; nmCategoria: string };
type MecanicaPayload = { id: number; nmMecanica: string };

const addItems = <T extends { id: number }>(
  target: T[],
  candidates: string[] | undefined,
  lookup: Record<string, ItemLookup>,
  labelKey: keyof Omit<T, "id">
) => {
  candidates?.forEach((nome) => {
    const found = lookup[nome];
    if (!found) return;
    if (target.some((item) => item.id === found.id)) return;
    target.push({ id: found.id, [labelKey]: found.descricao } as T);
  });
};

const applyAssociacao = (
  associacao: Associacao | undefined,
  temas: TemaPayload[],
  categorias: CategoriaPayload[],
  mecanicas: MecanicaPayload[]
) => {
  if (!associacao) return;
  addItems(mecanicas, associacao.mecanicas, MECANICA_LOOKUP, "nmMecanica");
  addItems(categorias, associacao.categorias, CATEGORIA_LOOKUP, "nmCategoria");
  addItems(temas, associacao.temas, TEMA_LOOKUP, "nmTema");
};

const buildInscricaoPayload = (eventoId: number, perfil: PerfilUsuario) => ({
  eventoId,
  participante: {
    nome: perfil.nome,
    sobrenome: perfil.sobrenome,
    genero: perfil.genero,
    email: perfil.email,
    telefone: perfil.telefone,
    perfilParticipante: (() => {
      const temas: TemaPayload[] = [];
      const categorias: CategoriaPayload[] = [];
      const mecanicas: MecanicaPayload[] = [];

      Object.entries(ASSOCIACOES_OPCOES).forEach(([campo, opcoes]) => {
        const valor = perfil[campo as keyof PerfilUsuario];
        if (typeof valor === "string") {
          applyAssociacao(opcoes[valor], temas, categorias, mecanicas);
        }
      });

      Object.entries(ASSOCIACOES_SIM).forEach(([campo, associacao]) => {
        if (perfil[campo as keyof PerfilUsuario] === "sim") {
          applyAssociacao(associacao, temas, categorias, mecanicas);
        }
      });

      return {
        experiencia: perfil.experience ?? 0,
        qntPessoas: toNumber(perfil.qntPessoas),
        tempJogo: tempoJogoValue(perfil.tempoJogo),
        idade: toNumber(perfil.idade),
        temas,
        categorias,
        mecanicas,
      };
    })(),
  },
});

export default function InscricaoEventoPage() {
  const params = useParams();
  const router = useRouter();
  const { eventos, fetch } = useEventosAtivosStore();
  const idParam = params?.id as string | string[] | undefined;
  const id = Number(Array.isArray(idParam) ? idParam[0] : idParam);

  const [loja, setLoja] = useState<Loja | null>(null);
  const [loadingLoja, setLoadingLoja] = useState<boolean>(false);
  const [step, setStep] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const totalSteps = 6;
  const { perfil } = usePerfilUsuarioStore();
  const [eventoDetalhes, setEventoDetalhes] = useState<Evento | null>(null);
  const [loadingJogos, setLoadingJogos] = useState<boolean>(true);
  const [searchJogos, setSearchJogos] = useState("");
  const [paginaJogos, setPaginaJogos] = useState(1);
  const pageSizeJogos = 5;
  const [inscricaoFeedback, setInscricaoFeedback] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const isFeedbackLoading = inscricaoFeedback === "loading";
  const isFeedbackSuccess = inscricaoFeedback === "success";
  const isFeedbackError = inscricaoFeedback === "error";

  const handleSubmit = async () => {
    if (!evento || isSubmitting) {
      if (!evento) console.warn("Evento não encontrado para montar o payload");
      return;
    }

    try {
      setIsSubmitting(true);
      setInscricaoFeedback("loading");
      const payload = buildInscricaoPayload(evento.id, perfil);
      await cadastrarParticipante(payload);
      console.log("Inscrição enviada", payload);
      setInscricaoFeedback("success");
    } catch (error) {
      console.error("Erro ao cadastrar participante", error);
      setInscricaoFeedback("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (!eventos || eventos.length === 0) fetch();
  }, [eventos?.length, fetch]);

  const evento = useMemo(
    () => (eventos || []).find((e) => e.id === id),
    [eventos, id]
  );

  const jogosEvento = eventoDetalhes?.jogos ?? [];

  const localEventoFormatado = useMemo(() => {
    if (loja) return obterEnderecoCompleto(loja);
    if (evento?.nomeLoja) return evento.nomeLoja;
    return "Local não informado";
  }, [loja, evento?.nomeLoja]);

  const dataEventoFormatada = useMemo(
    () => (evento ? formatarData(evento.dtInicio) : ""),
    [evento]
  );

  const jogosFiltrados = useMemo(() => {
    if (!jogosEvento.length) return [];
    const termo = searchJogos.trim().toLowerCase();
    if (!termo) return jogosEvento;
    return jogosEvento.filter((jogo) =>
      jogo.nomeJogo?.toLowerCase().includes(termo)
    );
  }, [jogosEvento, searchJogos]);

  const totalPaginasJogos = Math.max(
    1,
    Math.ceil(jogosFiltrados.length / pageSizeJogos)
  );
  const paginaAtualJogos = Math.min(paginaJogos, totalPaginasJogos);
  const jogosPagina = useMemo(() => {
    const start = (paginaAtualJogos - 1) * pageSizeJogos;
    return jogosFiltrados.slice(start, start + pageSizeJogos);
  }, [jogosFiltrados, paginaAtualJogos]);

  useEffect(() => {
    setPaginaJogos(1);
  }, [searchJogos]);

  useEffect(() => {
    if (paginaJogos > totalPaginasJogos) {
      setPaginaJogos(totalPaginasJogos);
    }
  }, [paginaJogos, totalPaginasJogos]);

  useEffect(() => {
    const run = async () => {
      if (evento?.lojaId) {
        try {
          setLoadingLoja(true);
          const { data } = await http.get<Loja>(
            endpoints.loja.getById(evento.lojaId)
          );
          setLoja(data);
        } catch {
          setLoja(null);
        } finally {
          setLoadingLoja(false);
        }
      }
    };
    run();
  }, [evento?.lojaId]);

  useEffect(() => {
    const fetchDetalhes = async () => {
      if (!id) return;
      try {
        setLoadingJogos(true);
        const data = await getEventoById(id);
        setEventoDetalhes(data);
      } catch (error) {
        console.error("Erro ao carregar detalhes do evento", error);
        setEventoDetalhes(null);
      } finally {
        setLoadingJogos(false);
      }
    };
    fetchDetalhes();
  }, [id]);

  const handleFinalizarCadastro = () => {
    setInscricaoFeedback("idle");
    router.push("/selecionarCidade");
  };

  const renderLoadingScreen = () => (
    <div className="min-h-screen bg-[#1C172E] flex flex-col items-center justify-center gap-4 px-6 text-white">
      <div className="w-12 h-12 border-4 border-[var(--color-purple-2)] border-t-transparent rounded-full animate-spin" />
      <p className="text-lg font-semibold">Enviando sua inscrição...</p>
      <p className="text-sm text-zinc-300 text-center">
        Aguarde um instante enquanto finalizamos tudo para você.
      </p>
    </div>
  );

  const renderSuccessScreen = () => (
    <div className="min-h-screen bg-[#1C172E] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-3xl rounded-2xl bg-[#120D26] text-white p-6 md:p-10 flex flex-col md:flex-row gap-8 shadow-2xl">
        <div className="flex justify-center md:justify-start">
          <div className="w-40 h-40 md:w-48 md:h-48">
            <img
              src="/ilustracao-sucesso.png"
              alt="Ilustração de inscrição concluída com sucesso"
              className="w-full h-full object-contain"
            />
          </div>
        </div>

        <div className="flex-1 flex flex-col gap-4">
          <div>
            <p className="text-sm font-semibold text-[#616EFF]">
              {evento?.nmEvento ||
                "Evento de jogos para com foco em jogadores experientes"}
            </p>
            <h2 className="text-2xl font-semibold mt-1">
              Você foi cadastrado com sucesso
            </h2>
            <p className="text-sm text-zinc-300">
              Estamos ansiosos para te ver!
            </p>
          </div>

          <div className="space-y-3 text-sm text-zinc-100">
            <div className="flex items-start gap-3">
              <FaStore className="mt-1 text-[#616EFF]" />
              <div>
                <p className="font-semibold text-white">Local do evento</p>
                <p className="text-zinc-300">{localEventoFormatado}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <FaClock className="mt-1 text-[#616EFF]" />
              <div>
                <p className="font-semibold text-white">Dia do evento</p>
                <p className="text-zinc-300">{dataEventoFormatada}</p>
              </div>
            </div>
          </div>

          <div className="flex justify-end mt-auto">
            <Button
              onClick={handleFinalizarCadastro}
              className="!rounded-full px-10 !bg-[#FFCB2B] !text-[#120D26] hover:opacity-90"
            >
              Finalizar
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderErrorScreen = () => (
    <div className="min-h-screen bg-[#1C172E] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-3xl rounded-2xl bg-[#120D26] text-white p-6 md:p-10 flex flex-col md:flex-row gap-8 shadow-2xl">
        <div className="flex justify-center md:justify-start">
          <div className="w-40 h-40 md:w-48 md:h-48">
            <img
              src="/Ilustracao-erro.png"
              alt="Ilustração de erro ao finalizar inscrição"
              className="w-full h-full object-contain"
            />
          </div>
        </div>

        <div className="flex-1 flex flex-col gap-4 text-center md:text-left">
          <div>
            <h2 className="text-2xl font-semibold">Serviço em manutenção</h2>
            <p className="text-sm text-zinc-300 mt-1">
              Nossos serviços estão fora do ar! Tente novamente mais tarde.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row justify-end gap-3 mt-auto">
            <Button
              variant="outlineGhostPurple"
              className="px-8 !text-[#FFCB2B] !border-[#FFCB2B] hover:!bg-transparent hover:!text-[#FFCB2B]"
              onClick={() => setInscricaoFeedback("idle")}
            >
              Voltar
            </Button>
            <Button
              onClick={handleSubmit}
              className="px-8 !bg-[#FFCB2B] !text-[#120D26] hover:opacity-90"
            >
              Tentar novamente
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

  if (isFeedbackLoading) {
    return renderLoadingScreen();
  }

  if (isFeedbackSuccess) {
    return renderSuccessScreen();
  }

  if (isFeedbackError) {
    return renderErrorScreen();
  }

  return (
    <>
      <div className="min-h-screen bg-[#1C172E] pt-25 pb-10 px-4 md:px-20">
        <div className="flex items-center justify-between mb-6">
          <Button
            variant="outlineGhostPurple"
            className="!rounded-full"
            onClick={() => router.back()}
            aria-label="Voltar"
          >
            <FaArrowLeft className="h-5 w-5 mr-2" />
            <span className="hidden sm:inline">Voltar</span>
          </Button>

          <div className="text-[#616EFF] text-xs">{evento?.cdEvento}</div>
        </div>

        <div className="grid grid-cols-12 gap-4 px-0 md:px-4">
          <div className="col-span-12 lg:col-span-6 order-2 lg:order-1 flex flex-col gap-2 h-auto justify-between lg:pr-10 text-center lg:text-left">
            <div>
              <span className="titulo-pagina-evento block mb-2  md:mb-4">
                {evento?.nmEvento}
              </span>
              <div className="flex flex-col sm:flex-row gap-1 sm:gap-2 mb-2 texto-medium-info !text-[#D9E8FF]">
                <div className="flex items-center gap-2 justify-center lg:justify-start">
                  <FaStore className="h-5 w-5" />
                  <span className="whitespace-nowrap">Local do Evento</span>
                </div>
                <span className="!text-[#ABB3BF]">
                  {loadingLoja
                    ? "Carregando local..."
                    : loja
                    ? obterEnderecoCompleto(loja)
                    : evento?.nomeLoja}
                </span>
              </div>
              <div className="flex flex-col sm:flex-row gap-1 sm:gap-2 mb-1 texto-medium-info !text-[#D9E8FF] !text-[18px]">
                <div className="flex items-center gap-2 justify-center lg:justify-start">
                  <FaClock />
                  <span className="whitespace-nowrap">Dia do Evento</span>
                </div>
                <span className="!text-[#ABB3BF]">
                  {evento ? formatarData(evento.dtInicio) : ""}
                </span>
              </div>

              <div className="mt-4 border-b border-zinc-600" />
            </div>
            <div className="mt-2">
              <div className="flex justify-center lg:justify-start">
                <p className="mb-3 text-[#ABB3BF]">Jogos neste evento</p>
              </div>
              <div className="w-full text-left">
                <Input
                  label="Buscar jogo"
                  placeholder="Digite o nome"
                  value={searchJogos}
                  onChange={setSearchJogos}
                  containerClassName="text-left"
                />
              </div>

              <div className="mt-4 border border-[var(--color-border-ligh-purple)] rounded-[8px] p-4 max-h-[280px] overflow-y-auto custom-scroll bg-[var(--background-color-6)]">
                {loadingJogos ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="w-8 h-8 border-2 border-[var(--color-purple-2)] border-t-transparent rounded-full animate-spin" />
                  </div>
                ) : jogosPagina.length === 0 ? (
                  <p className="text-sm text-zinc-400">
                    Nenhum jogo encontrado.
                  </p>
                ) : (
                  jogosPagina.map((jogo) => (
                    <div
                      key={jogo.id}
                      className="flex items-center gap-4 py-3 border-b border-white/5 last:border-b-0"
                    >
                      <div className="w-16 h-16 rounded-lg overflow-hidden bg-[#0F0F15] flex-shrink-0">
                        <img
                          src={jogo.thumb || "/logoalt.png"}
                          alt={`Capa do jogo ${jogo.nomeJogo}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-sm text-white">
                          {jogo.nomeJogo}
                        </p>
                        <p className="text-xs text-zinc-400">
                          {jogo.qtJogadoresMin && jogo.qtJogadoresMax
                            ? `${jogo.qtJogadoresMin}-${jogo.qtJogadoresMax} jogadores`
                            : null}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {jogosFiltrados.length > pageSizeJogos && (
                <div className="flex items-center justify-between mt-4 text-sm text-zinc-300">
                  <span>
                    Página {paginaAtualJogos} de {totalPaginasJogos}
                  </span>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outlineGhostPurple"
                      size="sm"
                      onClick={() => setPaginaJogos((p) => Math.max(1, p - 1))}
                      disabled={paginaAtualJogos === 1}
                    >
                      Anterior
                    </Button>
                    <Button
                      variant="outlineGhostPurple"
                      size="sm"
                      onClick={() =>
                        setPaginaJogos((p) =>
                          Math.min(totalPaginasJogos, p + 1)
                        )
                      }
                      disabled={paginaAtualJogos === totalPaginasJogos}
                    >
                      Próximo
                    </Button>
                  </div>
                </div>
              )}
            </div>

            <div className="texto-organizador flex justify-end gap-2 mt-8">
              Organizador
              <span className="!font-semibold !text-[#616EFF]  flex items-center gap-1">
                {evento?.nomeLoja} <FaCertificate />
              </span>
            </div>
          </div>

          <div className="col-span-12 lg:col-span-6 order-1 lg:order-2 flex flex-col justify-start items-stretch gap-4 px-0 md:px-20">
            <h1 className="titulo-pagina-evento text-center">
              Processo de inscrição
            </h1>
            <div className="w-full flex justify-center items-center">
              <div className="rounded-full w-fit px-8 py-1 bg-[var(--background-color-3)]">
                <p className="text-xs text-center bg-[var(--text-color-1)] bg-clip-text text-transparent">{`Passo ${step} de ${totalSteps}`}</p>
              </div>
            </div>
            <div className="w-full h-[1px] bg-zinc-600" />

            {step === 1 && <StepDadosPessoais next={() => setStep(2)} />}
            {step === 2 && (
              <StepPreferencias
                prev={() => setStep(1)}
                next={() => setStep(3)}
              />
            )}
            {step === 3 && (
              <StepEstiloJogo prev={() => setStep(2)} next={() => setStep(4)} />
            )}
            {step === 4 && (
              <StepEstiloJogo2
                prev={() => setStep(3)}
                next={() => setStep(5)}
              />
            )}
            {step === 5 && (
              <StepUniverso1 prev={() => setStep(4)} next={() => setStep(6)} />
            )}
            {step === 6 && (
              <StepUniverso2
                prev={() => setStep(5)}
                next={handleSubmit}
                nextLabel="Cadastrar"
                isSubmitting={isSubmitting}
              />
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
