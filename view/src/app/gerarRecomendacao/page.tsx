"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useRecomendacaoStore } from "@/stores/recomendacaoStore";
import { usePerfilUsuarioStore } from "@/stores/perfilUsuarioStore";
import { getMecanicas } from "@/api/mecanica";
import { getTemas } from "@/api/tema";
import Step1DadosPessoais from "@/components/Steps/Step1DadosPessoais/page";
import Step2PerfilJogador from "@/components/Steps/Step2DadosPessoais/page";
import Step3Mecanicas from "@/components/Steps/Step3Mecanicas/page";
import Step4Temas from "@/components/Steps/Step4Temas/page";
import { useState } from "react";

export default function GerarRecomendacao() {
  const [step, setStep] = useState(1);
  const totalSteps = 4;
  const router = useRouter();
  const { setResumo, setJogos } = useRecomendacaoStore();
  const { perfil } = usePerfilUsuarioStore();

  const [todasMecanicas, setTodasMecanicas] = useState([]);
  const [todosTemas, setTodosTemas] = useState([]);

  useEffect(() => {
    getMecanicas().then(setTodasMecanicas).catch(console.error);
    getTemas().then(setTodosTemas).catch(console.error);
  }, []);

  const prev = () => setStep((prev) => Math.max(prev - 1, 1));
  const next = () => setStep((prev) => Math.min(prev + 1, totalSteps));

  const gerarResumoPerfil = () => {
    const mapaTempo = {
      "1": "10 a 20",
      "2": "30 a 40",
      "3": "50 a 60",
      "4": "acima de 60",
    };
    const tempoConvertido = mapaTempo[perfil.tempoJogo] || "tempo indefinido";
    const qntPessoasTexto = perfil.qntPessoas === "6+" ? "6 ou mais" : perfil.qntPessoas;
    return `O perfil do jogador é de uma pessoa com ${perfil.idade} anos, que costuma jogar com ${qntPessoasTexto} pessoas, em partidas com duração média entre ${tempoConvertido} minutos. Demonstra preferências por mecânicas como ${perfil.mecanicasSelecionadas.join(", ")}, com interesse em temas de ${perfil.temasSelecionados.join(", ")}.`;
  };

  const finalizar = async () => {
    if (!perfil.temasSelecionados.length) {
      alert("Selecione ao menos um tema para continuar.");
      return;
    }
    const resumo = gerarResumoPerfil();
    setResumo(resumo);

    try {
      const res = await fetch("http://localhost:6000/api/recomendar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumo }),
      });
      const data = await res.json();
      setJogos(data);
    } catch {
      setJogos([
        {
          id: 9,
          anoPublicacao: 2003,
          anoNacional: 2003,
          idadeMinima: 12,
          nmJogo: "Dungeons & Dragons 3.5a. Edição: Livro do Jogador",
          qtJogadoresMax: 20,
          qtJogadoresMin: 2,
          thumb: "https://storage.googleapis.com/ludopedia-capas/14902_t.jpg",
          tpJogo: "b",
          vlTempoJogo: 90,
          artistas: [],
          designers: [],
          categorias: [],
          mecanicas: [],
          temas: [],
        },
      ]);
    }
    router.push("/recomendacoes");
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#0D0D12] to-[#1A162A] text-gray-100 flex flex-col items-center p-6 sm:p-12">
      <h1 className="text-2xl sm:text-3xl font-semibold mb-4">Cadastro</h1>
      <p className="text-sm text-indigo-300 mb-8">Passo {step} de {totalSteps}</p>
      <div className="bg-[#1E1E28] border border-[#3E3A5E] rounded-xl p-6 sm:p-10 shadow-lg w-full max-w-xl">
        {step === 1 && <Step1DadosPessoais next={next} />}
        {step === 2 && <Step2PerfilJogador next={next} prev={prev} />}
        {step === 3 && (
          <Step3Mecanicas
            todasMecanicas={todasMecanicas}
            next={next}
            prev={prev}
          />
        )}
        {step === 4 && (
          <Step4Temas
            todosTemas={todosTemas}
            finalizar={finalizar}
            prev={prev}
          />
        )}
      </div>
    </main>
  );
}
