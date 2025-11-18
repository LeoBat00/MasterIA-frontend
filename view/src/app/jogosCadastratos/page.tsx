"use client";
import Table, { Column, FetchParams } from "@/components/UI/Table";
import { Jogo } from "@/types/jogo";
import { useJogosCadastradoStore } from "@/stores/jogosCadastrados";
import { useCallback, useMemo, useState } from "react";

type ExpandableTextProps = {
  text?: string;
  limit?: number;
};

function ExpandableText({ text = "", limit = 90 }: ExpandableTextProps) {
  const [expanded, setExpanded] = useState(false);
  const shouldTruncate = text.length > limit;
  const displayText = useMemo(() => {
    if (expanded || !shouldTruncate) return text;
    return text.substring(0, limit).trimEnd() + "...";
  }, [expanded, shouldTruncate, text, limit]);

  if (!text) return <span>-</span>;

  return (
    <div className="flex flex-col space-y-2">
      <p className="text-sm text-white/80 break-words whitespace-pre-wrap">
        {displayText}
      </p>
      {shouldTruncate && (
        <button
          type="button"
          className="self-end text-xs font-semibold text-[#D9E8FF] border border-[#D9E8FF]/40 rounded-[8px] cursor-pointer px-2 py-0.5 hover:border-[#D9E8FF]/70 transition-colors"
          onClick={() => setExpanded((prev) => !prev)}
        >
          {expanded ? "ver menos" : "..."}
        </button>
      )}
    </div>
  );
}

export default function JogosCadastrados() {
  const { jogos, fetchJogosPaginado, tamanhoPagina, totalItens } =
    useJogosCadastradoStore();

  const columns: Column<Jogo>[] = [
    { Header: "Nome", accessor: "nmJogo" },
    { Header: "Ano", accessor: "anoPublicacao" },
    { Header: "Tipo", accessor: "tpJogo" },
    {
      Header: "Jogadores",
      accessor: (row) => `${row.qtJogadoresMin} - ${row.qtJogadoresMax}`,
    },
    {
      Header: "Categorias",
      accessor: (row) =>
        (row.categorias || []).map((c) => c.nmCategoria).join(", "),
    },
    {
      Header: "Mecânicas",
      Cell: (row) => (
        <ExpandableText
          text={(row.mecanicas || []).map((m) => m.nmMecanica).join(", ")}
          limit={90}
        />
      ),
    },
    {
      Header: "Temas",
      accessor: (row) => (row.temas || []).map((t) => t.nmTema).join(", "),
    },
  ];

  const buscarJogos = useCallback(
    async ({ page, pageSize }: FetchParams) => {
      await fetchJogosPaginado(page, pageSize);
    },
    [fetchJogosPaginado] // só muda se essa função mudar
  );

  return (
    <div className="relative min-h-screen w-full overflow-hidden text-white">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom_left,_#0E0E15_0%,_#14141F_100%)]" />
      <div
        className="pointer-events-none absolute inset-0 opacity-5"
        style={{
          backgroundImage: "url('/bgCadastroLoja.png')",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
        }}
      />

      <div className="relative mx-auto flex flex-col gap-6 px-4 py-6 lg:px-8">
        <header className="mb-2">
          <h1>
            <span className="text-zinc-200 font-light text-[38px]">
              Base de jogos do{" "}
            </span>
            <span className="bg-gradient-to-r font-semibold text-[38px] from-[#685BFF] via-[#951FFB] to-[#7C3AED] bg-clip-text text-transparent">
              MasterIA
            </span>
          </h1>
          <p className="text-[14px] text-zinc-400">
            Essa é a nossa base com todos os jogos salvos no sistema.
          </p>
          <div className="mt-2 border-b border-zinc-600" />
        </header>

        <section className=" shadow-xl">
          <Table<any>
            title="Jogos de Tabuleiro"
            columns={columns}
            data={jogos || []}
            total={totalItens}
            containerClassName="bg-[#12121B] p-4 rounded-lg"
            fetchData={buscarJogos}
            pageSizeOptions={[5, 10, 20, 50]}
            initialPageSize={tamanhoPagina}
            overlay="y"
            maxHeight="70vh"
          />
        </section>
      </div>
    </div>
  );
}
