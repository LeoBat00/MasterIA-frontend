"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { calcularStatus, formatarData, tempoRestante } from "@/app/util";
import { useEventoStore } from "@/stores/evento";
import Button from "@/components/UI/Button";
import Input from "@/components/UI/Input";
import { FiChevronDown, FiChevronUp, FiEdit3, FiSearch } from "react-icons/fi";
import { FaBox, FaUsers, FaChessBoard, FaBolt } from "react-icons/fa";
import { jogoEvento } from "@/types/jogo";
import { getGroupColorByIndex } from "@/utils/groupColors";
import { participanteGrupo } from "@/types/participante";
import { getRecomendacaoPerfil, RecomendacaoJogo } from "@/api/participante";

export default function DetalhesEventoPage() {
  const { eventoSelecionado, getEventoById, setEventoSelecionado } =
    useEventoStore();
  const router = useRouter();
  const params = useParams();
  const idEventoSelecionado = Number(params?.idEvento);

  const [isLoading, setIsLoading] = useState(true);
  const [buscaParticipante, setBuscaParticipante] = useState("");
  const [gruposExpandidos, setGruposExpandidos] = useState<
    Record<number, boolean>
  >({});
  const [recomendacoes, setRecomendacoes] = useState<RecomendacaoJogo[]>([]);
  const [loadingRecomendacao, setLoadingRecomendacao] = useState(false);
  const [participanteSelecionado, setParticipanteSelecionado] =
    useState<participanteGrupo | null>(null);
  const [mostrarModal, setMostrarModal] = useState(false);

  useEffect(() => {
    let ativo = true;
    setIsLoading(true);

    if (idEventoSelecionado && getEventoById) {
      getEventoById(idEventoSelecionado)
        .then((evento) => {
          if (ativo && evento) {
            setEventoSelecionado(evento);
          }
        })
        .finally(() => {
          if (ativo) setIsLoading(false);
        });
    } else {
      setIsLoading(false);
    }

    return () => {
      ativo = false;
    };
  }, [idEventoSelecionado, getEventoById, setEventoSelecionado]);

  const status = eventoSelecionado
    ? calcularStatus(eventoSelecionado)
    : undefined;

  const grupos = useMemo(
    () => eventoSelecionado?.grupos || [],
    [eventoSelecionado?.grupos]
  );

  const participantes = useMemo(() => {
    return grupos.flatMap((grupo) =>
      (grupo.participantes || []).map((participante) => ({
        ...participante,
        grupoId: grupo.id,
      }))
    );
  }, [grupos]);

  const participantesFiltrados = participantes.filter((p) => {
    if (!buscaParticipante.trim()) return true;
    const termo = buscaParticipante.toLowerCase();
    return (
      p.nome.toLowerCase().includes(termo) ||
      (p.sobrenome || "").toLowerCase().includes(termo) ||
      (p.email || "").toLowerCase().includes(termo)
    );
  });

  const qtdParticipantes = participantes.length;

  const jogosPorId = useMemo(() => {
    const mapa = new Map<number, jogoEvento>();
    (eventoSelecionado?.jogos || []).forEach((jogo) => {
      if (jogo?.id) mapa.set(jogo.id, jogo);
    });
    return mapa;
  }, [eventoSelecionado?.jogos]);

  const corGrupoPorId = useMemo(() => {
    const mapa = new Map<number, string>();
    grupos.forEach((grupo, idx) => {
      mapa.set(grupo.id, getGroupColorByIndex(idx));
    });
    return mapa;
  }, [grupos]);

  const toggleGrupo = (id: number) => {
    setGruposExpandidos((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const abrirModalRecomendacao = async (participante: participanteGrupo) => {
    setParticipanteSelecionado(participante);
    setMostrarModal(true);
    setLoadingRecomendacao(true);
    setRecomendacoes([]);
    try {
      const data = await getRecomendacaoPerfil(participante.id);
      setRecomendacoes(data.recommendations || []);
    } catch (error) {
      console.error("Erro ao buscar recomendações", error);
    } finally {
      setLoadingRecomendacao(false);
    }
  };

  const fecharModalRecomendacao = () => {
    setMostrarModal(false);
    setParticipanteSelecionado(null);
    setRecomendacoes([]);
    setLoadingRecomendacao(false);
  };

  const handleClickGerenciarJogos = () => {
    router.push(
      `/organizadorHome/loja/${eventoSelecionado?.lojaId}/${eventoSelecionado?.id}/jogos`
    );
  };

  const handleVoltar = () => {
    router.back();
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#685BFF]/40 border-t-[#685BFF]" />
      </div>
    );
  }

  if (!eventoSelecionado) {
    return <div className="page">Evento não encontrado!</div>;
  }

  return (
    <div className="page">
      <div className="flex items-start justify-between mb-6 gap-4">
        <div>
          <p className="text-zinc-400 text-sm">Gerencie seu evento</p>
          <p className="texto-medium-md text-[#D9E8FF]">
            {eventoSelecionado.nmEvento}
          </p>
        </div>
      </div>

      {mostrarModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
          <div className="relative w-full max-w-2xl rounded-[12px] border border-white/10 bg-[#0F0F17] p-5 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm text-zinc-400">Recomendações para</p>
                <p className="text-lg font-semibold text-white">
                  {participanteSelecionado?.nome}{" "}
                  {participanteSelecionado?.sobrenome}
                </p>
              </div>
              <button
                className="h-9 w-9 rounded-full bg-[#1C1C2D] border border-white/10 text-white cursor-pointer hover:opacity-80"
                onClick={fecharModalRecomendacao}
              >
                ✕
              </button>
            </div>

            {loadingRecomendacao ? (
              <div className="flex min-h-[160px] items-center justify-center">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#685BFF]/40 border-t-[#685BFF]" />
              </div>
            ) : (
              <div className="space-y-3 max-h-[420px] overflow-y-auto custom-scroll pr-1">
                {recomendacoes.length > 0 ? (
                  recomendacoes.map((rec) => (
                    <div
                      key={rec.id_mysql}
                      className="flex items-center gap-3 rounded-[10px] border border-white/5 bg-[#12121B] p-3"
                    >
                      {rec.thumb ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={rec.thumb}
                          alt={rec.nmJogo}
                          className="h-14 w-14 rounded-md object-cover"
                        />
                      ) : (
                        <div className="h-14 w-14 rounded-md bg-[#1F1F2B]" />
                      )}
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-white">
                          {rec.nmJogo}
                        </p>
                        <p className="text-xs text-zinc-400">
                          Semântica: {rec.semantic_score.toFixed(2)} |
                          Popularidade: {rec.popularity_score.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-zinc-400">
                    Nenhuma recomendação encontrada para este participante.
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      <h3 className="font-semibold mb-2 text-[#D9E8FF]">Detalhes do Evento</h3>
      <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.9fr] gap-6">
        <div className="space-y-4">
          <div className="rounded-[12px] border border-white/10 bg-gradient-to-b from-[#0F0F17] to-[#09080F] p-5">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <p className="text-sm text-zinc-400">Código</p>
                <p className="text-lg font-semibold text-white">
                  {eventoSelecionado.cdEvento}
                </p>
                <p className="text-sm text-zinc-400 mt-2">Data</p>
                <p className="text-base text-[#D9E8FF]">
                  {formatarData(eventoSelecionado.dtInicio)}
                </p>
              </div>
              <div className="text-right flex flex-col items-end gap-2">
                <p className="text-xs text-zinc-400 uppercase">Faltam</p>
                <p className="text-2xl font-bold text-white">
                  {status ? tempoRestante(eventoSelecionado, status) : "-"}
                </p>
                <div className="mt-2 flex items-center text-sm font-regular border-2 border-[#72D999]/10 w-fit rounded-[8px] px-2 py-0.5 text-[#72D999] bg-[#72D999]/10">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">Status</span>
                    <span className="font-light">
                      {status
                        ? status === "EmAndamento"
                          ? "Em andamento"
                          : status
                        : "-"}
                    </span>
                  </div>
                </div>
                <span className="text-sm text-zinc-300">
                  Limite de participantes: {eventoSelecionado.qtdLimite ?? "-"}
                </span>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-end gap-3">
              <div className="flex flex-wrap gap-3">
                <Button
                  variant="outlineGhostPurple"
                  size="sm"
                  leftIcon={<FiEdit3 />}
                  onClick={() =>
                    router.push(
                      `/organizadorHome/loja/${eventoSelecionado.lojaId}/${eventoSelecionado.id}`
                    )
                  }
                >
                  Editar Evento
                </Button>
                <Button
                  variant="outlineGhostPurple"
                  size="sm"
                  leftIcon={<FaChessBoard />}
                  onClick={handleClickGerenciarJogos}
                >
                  Jogos do Evento
                </Button>
              </div>
            </div>
          </div>

          <div className="rounded-[12px] border border-white/10 bg-[#0F0F17] p-5">
            <div className="flex items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-2">
                <FaUsers className="text-[#8F8FFF]" />
                <p className="font-semibold text-[#D9E8FF]">
                  Pessoas Cadastradas {qtdParticipantes ?? 0}
                </p>
              </div>
            </div>

            <Input
              placeholder="Buscar por nome ou email"
              value={buscaParticipante}
              onChange={setBuscaParticipante}
              leftIcon={<FiSearch />}
              containerClassName="mb-3"
            />

            <div className="max-h-80 overflow-y-auto space-y-2 pr-1">
              {participantesFiltrados.length > 0 ? (
                participantesFiltrados.map((p) => (
                  <div
                    key={p.id}
                    className="flex items-center justify-between rounded-[8px] border border-white/5 bg-[#12121B] px-3 py-2"
                    style={{
                      borderLeftColor: corGrupoPorId.get(p.grupoId ?? -1),
                      borderLeftWidth: "6px",
                      borderLeftStyle: "solid",
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 flex items-center justify-center rounded-full bg-[#1F1F2B] text-white/80">
                        {p.nome.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm text-white">
                          {p.nome} {p.sobrenome}
                        </p>
                        <p className="text-xs text-zinc-400">{p.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-zinc-500">
                        {p.telefone}
                      </span>
                      <button
                        type="button"
                        onClick={() => abrirModalRecomendacao(p)}
                        className="h-8 w-8 rounded-full bg-[#0B0A0E] border cursor-pointer border-[#685BFF]/60 flex items-center justify-center text-[#D9E8FF] hover:opacity-90 transition"
                        title="Recomendação rápida de jogos"
                      >
                        <FaBolt />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-zinc-400">
                  Nenhum participante encontrado.
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="rounded-[12px] border border-white/10 bg-[#0F0F17] p-5 h-fit">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <FaBox className="text-[#8F8FFF]" />
              <p className="font-semibold text-[#D9E8FF]">
                Grupos Criados ({(eventoSelecionado.grupos || []).length})
              </p>
            </div>
          </div>

          <div className="space-y-2">
            {grupos.length > 0 ? (
              grupos.map((grupo, idx) => {
                const jogosDoGrupo = (grupo.idJogosEventos || [])
                  .map((id) => jogosPorId.get(id))
                  .filter(Boolean);

                const expandido = gruposExpandidos[grupo.id] ?? false;

                return (
                  <div
                    key={grupo.id}
                    className="rounded-[10px] border  border-white/5 bg-[#12121B] px-3 py-2"
                    style={{
                      borderLeftColor: getGroupColorByIndex(idx),
                      borderLeftWidth: "6px",
                      borderLeftStyle: "solid",
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => toggleGrupo(grupo.id)}
                      className="flex w-full cursor-pointer items-center justify-between text-left"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-white font-semibold">
                          {grupo.nmGrupo}
                        </span>
                        <span className="text-xs text-zinc-400">
                          {grupo.participantes.length} participantes
                        </span>
                      </div>
                      {expandido ? (
                        <FiChevronUp className="text-zinc-400" />
                      ) : (
                        <FiChevronDown className="text-zinc-400" />
                      )}
                    </button>

                    {expandido && (
                      <div className="mt-3 space-y-2 max-h-56 overflow-y-auto pr-1">
                        {jogosDoGrupo.length > 0 ? (
                          jogosDoGrupo.map((jogo) => (
                            <div
                              key={jogo!.id}
                              className="flex items-center gap-3 rounded-[8px] bg-[#0F0F17] border border-white/5 px-3 py-2"
                            >
                              {jogo?.thumb ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                  src={jogo.thumb}
                                  alt={jogo.nomeJogo}
                                  className="h-10 w-10 rounded-md object-cover"
                                />
                              ) : (
                                <div className="h-10 w-10 rounded-md bg-[#1F1F2B]" />
                              )}
                              <div>
                                <p className="text-sm text-white">
                                  {jogo?.nomeJogo}
                                </p>
                                <p className="text-xs text-zinc-400">
                                  {jogo?.qtJogadoresMin} -{" "}
                                  {jogo?.qtJogadoresMax} jogadores
                                </p>
                              </div>
                            </div>
                          ))
                        ) : (
                          <p className="text-sm text-zinc-400">
                            Nenhum jogo associado a este grupo.
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              <p className="text-sm text-zinc-400">
                Nenhum grupo criado para este evento.
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <Button variant="outlineGhost" onClick={handleVoltar}>
          Voltar
        </Button>
      </div>
    </div>
  );
}
