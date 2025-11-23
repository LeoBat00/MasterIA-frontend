"use client";

import { useCadastroEventosStore } from "@/stores/cadastroEventos";
import Button from "@/components/UI/Button";
import { FaChevronRight } from "react-icons/fa";
import { useEffect, useMemo, useState } from "react";
import { getCidadesDisponiveis, CidadeDisponivel } from "@/api/evento";
import { useRouter } from "next/navigation";
import { slugifyCidade } from "@/app/util";

export default function SelecionarCidade() {
  const { cidadeSelecionada, setCidadeSelecionada } = useCadastroEventosStore();
  const router = useRouter();

  const [cidadesDisponiveis, setCidadesDisponiveis] = useState<
    CidadeDisponivel[]
  >([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const run = async () => {
      try {
        setLoading(true);
        const data = await getCidadesDisponiveis();
        setCidadesDisponiveis(data ?? []);
      } catch {
        setCidadesDisponiveis([]);
      } finally {
        setLoading(false);
      }
    };
    run();
  }, []);

  const cidadesRankedByEventos = useMemo(() => {
    return [...cidadesDisponiveis].sort((a, b) => b.qtdEventos - a.qtdEventos);
  }, [cidadesDisponiveis]);

  const formatLabel = (nome: string) => {
    if (!nome) return "";
    return nome
      .toLowerCase()
      .split("-")
      .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
      .join(" ");
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-8 bg-[#1C172E]">
      <div className="w-[600px] bg-[#1E1B2E] p-6 rounded-lg shadow-lg border border-white/10">
        <h1 className="text-2xl font-bold mb-4">Seleciona sua cidade</h1>
        <p className="mb-5 text-[#D9E8FFA6]">Eventos que estão ativos agora!</p>

        {loading && (
          <div className="p-4 bg-[#2F2B43] rounded-lg mb-2 text-[#D9E8FF] opacity-70">
            Carregando cidades...
          </div>
        )}

        {!loading && cidadesRankedByEventos.length === 0 && (
          <div className="p-4 bg-[#2F2B43] rounded-lg mb-2 text-[#D9E8FF] opacity-70">
            Nenhum evento ativo no momento.
          </div>
        )}

        {!loading &&
          cidadesRankedByEventos.map((c) => (
            <div
              key={c.cidade}
              role="button"
              className="p-4 cursor-pointer bg-[#2F2B43] rounded-lg mb-2 hover:bg-white/20 text-[#D9E8FF] flex items-center justify-between"
              tabIndex={0}
              onClick={() => {
                const slug = slugifyCidade(c.cidade);
                setCidadeSelecionada(c.cidade);
                router.push(`/cidade/${slug}`);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  const slug = slugifyCidade(c.cidade);
                  setCidadeSelecionada(c.cidade);
                  router.push(`/cidade/${slug}`);
                }
              }}
            >
              <span>{formatLabel(c.cidade)}</span>
              <span className="flex items-center gap-3">
                <span className="text-sm text-[#D9E8FF]/80">
                  {c.qtdEventos} {c.qtdEventos === 1 ? "evento" : "eventos"}
                </span>
                <FaChevronRight className="h-5 w-5 text-[#D9E8FF]" />
              </span>
            </div>
          ))}

        <div className="mt-4 border-b border-zinc-600" />

        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outlineGhost" onClick={() => router.push("/")}>
            Voltar
          </Button>

          <Button
            onClick={() => {
              if (cidadeSelecionada) {
                const slug = slugifyCidade(cidadeSelecionada);
                router.push(`/cidade/${slug}`);
              }
            }}
            disabled={!cidadeSelecionada}
          >
            Ver eventos
          </Button>
        </div>
      </div>
    </div>
  );
}
