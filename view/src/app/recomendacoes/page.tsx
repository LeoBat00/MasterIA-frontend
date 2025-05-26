"use client";

import Header from "@/components/Header";
import { useRecomendacaoStore } from "@/stores/recomendacaoStore";

export default function RecomendacoesPage() {
  const { resumo, jogos } = useRecomendacaoStore();

  return (
    <>
    <Header/>
    <main className="min-h-screen bg-[#12121A] text-white p-8">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6">Perfil do Jogador</h1>
      {resumo && <p className="text-lg text-gray-300 mb-10">{resumo}</p>}

      <h2 className="text-xl font-semibold mb-4">Jogos Recomendados</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {jogos.map((jogo) => (
          <div
            key={jogo.id}
            className="bg-[#1E1E2E] rounded-lg shadow-md overflow-hidden"
          >
            <img
              src={jogo.thumb}
              alt={jogo.nmJogo}
              className="w-full h-48 object-cover"
            />
            <div className="p-4 space-y-2">
              <h3 className="text-lg font-semibold">{jogo.nmJogo}</h3>
              <p className="text-sm text-gray-400">
                Jogadores: {jogo.qtJogadoresMin}–{jogo.qtJogadoresMax}
              </p>
              <p className="text-sm text-gray-400">
                Idade mínima: {jogo.idadeMinima}+
              </p>
              <p className="text-sm text-gray-400">
                Tempo médio: {jogo.vlTempoJogo} min
              </p>
            </div>
          </div>
        ))}
      </div>
    </main>
    </>
  );
}
