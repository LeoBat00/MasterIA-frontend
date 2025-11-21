"use client";

import { usePaginaLojaStore } from "@/stores/paginaLoja";
import { obterEnderecoCompleto } from "../../../util";
import { FaStore, FaChessBoard, FaCalendar } from "react-icons/fa";
import { CardAtalho } from "../../../../components/Cards/CardAtalho";
import { CardEvento } from "./CardEvento";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { calcularStatus } from "../../../util";
import Button from "@/components/UI/Button";
import { useRouter } from "next/navigation";

export default function PageLoja() {
  const { lojaSelecionada, fetchLoja } = usePaginaLojaStore();
  const params = useParams(); // pega params da rota, ex: /loja/[id]
  const lojaId = Number(params?.id);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [hoveredAtalho, setHoveredAtalho] = useState<string | null>(null);

  const listaEventosAtivos =
    (lojaSelecionada?.eventos ?? []).filter((evento) => {
      const statusAtual = calcularStatus(evento);
      return statusAtual === "Ativo" || statusAtual === "EmAndamento";
    }) || [];

  useEffect(() => {
    if (!lojaId || !fetchLoja) return;

    let isMounted = true;
    setLoading(true);

    fetchLoja(lojaId)
      .then((res) => {
        if (!res.success) {
          console.error("Erro ao buscar loja:", res.error);
        }
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [lojaId, fetchLoja]);

  const handleVoltar = () => {
    router.push("/organizadorHome");
  };

  const handleClickGerenciarEventos = () => {
    router.push(`/organizadorHome/loja/${lojaId}/eventos`);
  };

  const handleClickCadastroJogos = () => {
    router.push(`/organizadorHome/loja/${lojaId}/jogosLoja`);
  };

  const handleClickCardEvento = (idEvento: number) => {
    router.push(`/organizadorHome/loja/${lojaId}/${idEvento}`);
  };

  return (
    <div className="">
      {loading ? (
        <div className="flex min-h-[40vh] items-center justify-center">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#685BFF]/40 border-t-[#685BFF]" />
        </div>
      ) : lojaSelecionada ? (
        <div className="relative mx-auto flex">
          <div className="flex-1">
            <p className="mt-1 text-sm text-zinc-400">Gerencie sua loja</p>
            <div className="mt-2 border-b border-zinc-600 mb-4" />

            <div className="flex items-center rounded-[8px] justify-between border bg-[#08080C]  border-[#685BFF] px-2 mb-5">
              <div className="text-sm font-medium text-[var(--text-color-info)]">
                <div className="grid grid-cols-[120px_1fr] gap-y-1 p-3">
                  <span className="font-regular">Endereço</span>
                  <span>{obterEnderecoCompleto(lojaSelecionada)}</span>

                  <span className="font-medium">Status</span>
                  <span className="font-semibold">
                    {lojaSelecionada.status ? "Ativo" : "Inativo"}
                  </span>
                </div>
              </div>
            </div>
            <h3 className="font-semibold mb-2 text-[#D9E8FF]">Serviços </h3>
            <div
              className="w-full flex gap-4 justify-between bg-[var(--background-color-6)] rounded-[8px] p-4 mb-6"
              onMouseLeave={() => setHoveredAtalho(null)}
            >
              <CardAtalho
                onClick={handleClickGerenciarEventos}
                icon={<FaCalendar />}
                label="Gerenciar Eventos"
                onHoverStart={() => setHoveredAtalho("gerenciar-eventos")}
                onHoverEnd={() => setHoveredAtalho(null)}
                isDimmed={
                  hoveredAtalho !== null &&
                  hoveredAtalho !== "gerenciar-eventos"
                }
              />
              <CardAtalho
                onClick={handleClickCadastroJogos}
                icon={<FaChessBoard />}
                label="Cadastro de Jogos"
                onHoverStart={() => setHoveredAtalho("cadastro-jogos")}
                onHoverEnd={() => setHoveredAtalho(null)}
                isDimmed={
                  hoveredAtalho !== null && hoveredAtalho !== "cadastro-jogos"
                }
              />
              <CardAtalho
                onClick={() => console.log("Dados da loja")}
                icon={<FaStore />}
                label="Dados da Loja"
                onHoverStart={() => setHoveredAtalho("dados-loja")}
                onHoverEnd={() => setHoveredAtalho(null)}
                isDimmed={
                  hoveredAtalho !== null && hoveredAtalho !== "dados-loja"
                }
              />
            </div>

            <h3 className="font-semibold mb-2 text-[#D9E8FF]">
              Eventos Ativos{" "}
            </h3>

            <div className="grid grid-cols-[repeat(auto-fit,minmax(250px,300px))] justify-start gap-4 mb-6">
              {listaEventosAtivos.length > 0 ? (
                listaEventosAtivos.map((evento) => (
                  <CardEvento
                    key={evento.id}
                    evento={evento}
                    onClick={(evento) => handleClickCardEvento(evento.id)}
                  />
                ))
              ) : (
                <span className="text-zinc-400">Nenhum evento ativo</span>
              )}
            </div>
            <div className="flex justify-end  self-end space-x-4">
              <Button onClick={handleVoltar}>
                <span className="px-16">Voltar</span>
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div>
          <h1>Nenhuma loja selecionada</h1>
        </div>
      )}
    </div>
  );
}
