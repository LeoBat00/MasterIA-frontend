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
import { usePerfilUsuarioStore, type PerfilUsuario } from "@/stores/perfilUsuarioStore";
import { MECANICAS_LIST } from "@/enums/mecanicas";
import { CATEGORIAS_LIST } from "@/enums/categorias";
import { TEMAS_LIST } from "@/enums/temas";
import { cadastrarParticipante } from "@/api/participante";

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
      mecanicas: [
        "Rolagem de Dados",
        "Force sua sorte",
        "Apostas e Blefes",
      ],
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

  const handleSubmit = async () => {
    if (!evento || isSubmitting) {
      if (!evento) console.warn("Evento não encontrado para montar o payload");
      return;
    }

    try {
      setIsSubmitting(true);
      const payload = buildInscricaoPayload(evento.id, perfil);
      await cadastrarParticipante(payload);
      console.log("Inscrição enviada", payload);
    } catch (error) {
      console.error("Erro ao cadastrar participante", error);
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

  return (
    <>
      <div className="min-h-screen bg-[#1C172E] pt-25 pb-10 px-4 md:px-20">
        <div className="flex items-center justify-between mb-6">
          <Button
            variant="outlineGhostPurple"
            className="!rounded-full"
            onClick={() => router.back()}
          >
            <FaArrowLeft className="h-5 w-5 mr-2" />
            Voltar
          </Button>

          <div className="text-[#616EFF] text-xs">{evento?.cdEvento}</div>
        </div>

        <div className="grid grid-cols-12 gap-4 px-0 md:px-4">
          <div className="col-span-12 lg:col-span-6 flex flex-col gap-2 h-auto justify-between lg:pr-10">
            <div>
              <span className="titulo-pagina-evento mb-10">
                {evento?.nmEvento}
              </span>
              <div className="flex gap-2 mb-1 texto-medium-info !text-[#D9E8FF]">
                <FaStore className="h-5 w-5" />
                <span className="whitespace-nowrap">Local do Evento</span>
                <span className="!text-[#ABB3BF]">
                  {loadingLoja
                    ? "Carregando local..."
                    : loja
                    ? obterEnderecoCompleto(loja)
                    : evento?.nomeLoja}
                </span>
              </div>
              <div className="flex items-center gap-2 mb-1 texto-medium-info !text-[#D9E8FF] !text-[18px]">
                <FaClock />
                <span className="whitespace-nowrap">Dia do Evento</span>
                <span className="!text-[#ABB3BF]">
                  {evento ? formatarData(evento.dtInicio) : ""}
                </span>
              </div>

              <div className="mt-4 border-b border-zinc-600" />
            </div>
            <div className="texto-organizador flex justify-end gap-2">
              Organizador
              <span className="!font-semibold !text-[#616EFF]  flex items-center gap-1">
                {evento?.nomeLoja} <FaCertificate />
              </span>
            </div>
          </div>

          <div className="col-span-12 lg:col-span-6 flex flex-col justify-center items-stretch gap-4 px-0 md:px-20">
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
              <StepEstiloJogo2 prev={() => setStep(3)} next={() => setStep(5)} />
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
