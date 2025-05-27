"use client";

import Header from "@/components/Header";
import { useRecomendacaoStore } from "@/stores/recomendacaoStore";
import {motion} from "framer-motion";

export default function RecomendacoesPage() {
  const { resumo, jogos } = useRecomendacaoStore();

  return (
    <>
      <Header />
      <main className="min-h-screen bg-[#12121A] text-white px-6 sm:px-12 lg:px-24 py-12">
        <h1 className="text-3xl sm:text-4xl font-bold mb-8">Perfil do Jogador</h1>

        
        {resumo && (
          <div className="bg-[#1A1A26] border border-[#2C2C3A] rounded-xl p-6 mb-12 shadow-lg text-sm sm:text-base leading-relaxed text-gray-300 font-mono">
            <p className="whitespace-pre-line inline">
              {resumo}
              <motion.span
                className="inline-block ml-1"
                initial={{ opacity: 1 }}
                animate={{ opacity: [1, 0, 1] }}
                transition={{ repeat: Infinity, duration: 1 }}
              >
                |
              </motion.span>
            </p>
          </div>
        )}


        <h2 className="text-2xl font-semibold mb-6">Jogos Recomendados</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {jogos.map((jogo) => (
            <div
              key={jogo.id}
              className="bg-[#1E1E2E] border border-[#2C2C3A] rounded-xl shadow-lg overflow-hidden flex flex-col h-full transition hover:scale-[1.02]"
            >
              <div className="h-36 bg-[#2A2A38] flex items-center justify-center">
                {jogo.thumb ? (
                  <img
                    src={jogo.thumb}
                    alt={jogo.nmJogo}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-gray-500 text-sm">Imagem não disponível</span>
                )}
              </div>

              <div className="p-4 flex-1 flex flex-col space-y-2">
                <h3 className="text-lg font-semibold text-white truncate">{jogo.nmJogo}</h3>

                <div className="text-sm text-gray-400 space-y-1">
                  <p>👥 {jogo.qtJogadoresMin}–{jogo.qtJogadoresMax} jogadores</p>
                  <p>🎯 Idade mínima: {jogo.idadeMinima}+</p>
                  <p>⏱️ {jogo.vlTempoJogo} min</p>
                </div>

                <div className="mt-2 text-xs text-gray-300">
                  <p className="font-medium">Mecânicas:</p>
                  <p className="text-gray-400">
                    {jogo.mecanicas.length > 0
                      ? jogo.mecanicas.join(", ")
                      : "Não especificado"}
                  </p>
                </div>

                <div className="text-xs text-gray-300">
                  <p className="font-medium">Temas:</p>
                  <p className="text-gray-400">
                    {jogo.temas.length > 0
                      ? jogo.temas.join(", ")
                      : "Não especificado"}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </>
  );
}
