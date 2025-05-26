"use client";
import { useRouter } from "next/navigation";
import { useRecomendacaoStore } from "@/stores/recomendacaoStore";

import { useEffect, useState } from "react";
import {
  FiUser,
  FiMail,
  FiPhone,
  FiSliders,
  FiUsers,
  FiClock,
  FiCalendar,
  FiStar,
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { getMecanicas } from "@/api/mecanica";
import { getTemas } from "@/api/tema";

export default function gerarRecomendacao() {
  const [step, setStep] = useState(1);
  const totalSteps = 4;
  const router = useRouter();
  const { setResumo, setJogos } = useRecomendacaoStore();

  useEffect(() => {
    getMecanicas()
      .then(setTodasMecanicas)
      .catch((err) => console.error("Erro ao carregar mecânicas:", err));

    getTemas()
      .then(setTodosTemas)
      .catch((err) => console.error("Erro ao carregar temas:", err));
  }, []);
  const prev = () => setStep((prev) => Math.max(prev - 1, 1));

  const [experience, setExperience] = useState<number>(0);
  const [qntPessoas, setQntPessoas] = useState<number | string>("");
  const [tempoJogo, setTempoJogo] = useState<string>("");
  const [idade, setIdade] = useState<number | "">("");
  const [mecanicasSelecionadas, setMecanicasSelecionadas] = useState<string[]>(
    []
  );
  const [temasSelecionados, setTemasSelecionados] = useState<string[]>([]);
  const [buscaMecanica, setBuscaMecanica] = useState("");
  const [buscaTema, setBuscaTema] = useState("");
  const [nome, setNome] = useState("");
  const [sobrenome, setSobrenome] = useState("");
  const [genero, setGenero] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");

  const validarStep1 = () => {
    return (
      nome.trim() &&
      sobrenome.trim() &&
      genero &&
      email.trim() &&
      telefone.trim()
    );
  };

  const validarStep2 = () => {
    return (
      experience > 0 &&
      qntPessoas !== "" &&
      tempoJogo &&
      idade !== "" &&
      idade > 0
    );
  };

  const validarStep3 = () => {
    return mecanicasSelecionadas.length > 0;
  };

  const validarStep4 = () => {
    return temasSelecionados.length > 0;
  };
  const next = () => {
    if (
      (step === 1 && !validarStep1()) ||
      (step === 2 && !validarStep2()) ||
      (step === 3 && !validarStep3())
    ) {
      alert(
        "Preencha todos os campos obrigatórios corretamente antes de prosseguir."
      );
      return;
    }
    setStep((prev) => Math.min(prev + 1, totalSteps));
  };
  const finalizar = async () => {
    if (!validarStep4()) {
      alert("Selecione ao menos um tema para continuar.");
      return;
    }

    const resumo = gerarResumoPerfil();
    setResumo(resumo);

    try {
      const response = await fetch("http://localhost:6000/api/recomendar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumo }),
      });

      if (!response.ok) throw new Error("Erro ao obter recomendações");

      const data = await response.json();
      setJogos(data);
    } catch (error) {
      console.error("Erro ao buscar recomendações:", error);
      const mockJogos = [
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
      ];
      setJogos(mockJogos);
    }

    router.push("/recomendacoes");
  };
  const [todasMecanicas, setTodasMecanicas] = useState<
    { id: number; nmMecanica: string }[]
  >([]);
  const [todosTemas, setTodosTemas] = useState<
    { id: number; nmTema: string }[]
  >([]);
  const gerarResumoPerfil = () => {
    const mapaTempo = {
      "1": "10 a 20",
      "2": "30 a 40",
      "3": "50 a 60",
      "4": "acima de 60",
    };

    const tempoConvertido = mapaTempo[tempoJogo] || "tempo indefinido";
    const qntPessoasTexto = qntPessoas === "6+" ? "6 ou mais" : qntPessoas;

    const resumo = `O perfil do jogador é de uma pessoa com ${idade} anos, que costuma jogar com ${qntPessoasTexto} pessoas, em partidas com duração média entre ${tempoConvertido} minutos. Demonstra preferências por mecânicas como ${mecanicasSelecionadas.join(
      ", "
    )}, com interesse em temas de ${temasSelecionados.join(", ")}.`;

    return resumo;
  };
  return (
    <main className="min-h-screen bg-gradient-to-br from-[#0D0D12] to-[#1A162A] text-gray-100 flex flex-col items-center p-6 sm:p-12">
      <h1 className="text-2xl sm:text-3xl font-semibold mb-4">Cadastro</h1>
      <p className="text-sm text-indigo-300 mb-8">
        Passo {step} de {totalSteps}
      </p>

      <div className="bg-[#1E1E28] border border-[#3E3A5E] rounded-xl p-6 sm:p-10 shadow-lg w-full max-w-xl">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              <div className="flex flex-col gap-2">
                <label className="flex items-center gap-2">
                  <FiUser /> Nome
                </label>
                <input
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  type="text"
                  className="bg-[#2A2A3D] p-2 rounded-lg text-white outline-none"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="flex items-center gap-2">
                  <FiUser /> Sobrenome
                </label>
                <input
                  type="text"
                  value={sobrenome}
                  onChange={(e) => setSobrenome(e.target.value)}
                  className="bg-[#2A2A3D] p-2 rounded-lg text-white outline-none"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="flex items-center gap-2">
                  <FiSliders /> Gênero
                </label>
                <select
                  value={genero}
                  onChange={(e) => setGenero(e.target.value)}
                  className="bg-[#2A2A3D] p-2 rounded-lg text-white outline-none"
                >
                  <option value="">Selecione</option>
                  <option value="M">Masculino</option>
                  <option value="F">Feminino</option>
                  <option value="O">Outro</option>
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <label className="flex items-center gap-2">
                  <FiMail /> E-mail
                </label>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  className="bg-[#2A2A3D] p-2 rounded-lg text-white outline-none"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="flex items-center gap-2">
                  <FiPhone /> Telefone
                </label>
                <input
                  value={telefone}
                  onChange={(e) => setTelefone(e.target.value)}
                  type="tel"
                  className="bg-[#2A2A3D] p-2 rounded-lg text-white outline-none"
                />
              </div>

              <div className="flex justify-end mt-6">
                <button
                  onClick={next}
                  className="bg-indigo-600 px-6 py-2 rounded-xl hover:bg-indigo-700 transition"
                >
                  Próximo
                </button>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              {/* EXPERIÊNCIA COM ESTRELAS */}
              <div className="flex flex-col gap-2">
                <label className="flex items-center gap-2">
                  <FiStar /> Nível de Experiência
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((level) => (
                    <button
                      key={level}
                      onClick={() => setExperience(level)}
                      className={`text-2xl transition ${
                        experience >= level
                          ? "text-yellow-400"
                          : "text-gray-500"
                      }`}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>

              {/* QUANTIDADE DE PESSOAS */}
              <div className="flex flex-col gap-2">
                <label className="flex items-center gap-2">
                  <FiUsers /> Quantidade de jogadores
                </label>
                <select
                  value={qntPessoas}
                  onChange={(e) => setQntPessoas(e.target.value)}
                  className="bg-[#2A2A3D] p-2 rounded-lg text-white outline-none"
                >
                  <option value="">Selecione</option>
                  {[2, 3, 4, 5, "6+"].map((val) => (
                    <option key={val} value={val}>
                      {val}
                    </option>
                  ))}
                </select>
              </div>

              {/* TEMPO MÉDIO DE JOGO */}
              <div className="flex flex-col gap-2">
                <label className="flex items-center gap-2">
                  <FiClock /> Tempo médio de jogo
                </label>
                <select
                  value={tempoJogo}
                  onChange={(e) => setTempoJogo(e.target.value)}
                  className="bg-[#2A2A3D] p-2 rounded-lg text-white outline-none"
                >
                  <option value="">Selecione</option>
                  <option value="1">Jogos rápidos (10–20 min)</option>
                  <option value="2">Jogos médios (30–40 min)</option>
                  <option value="3">Jogos longos (50–60 min)</option>
                  <option value="4">Jogos muito longos (60+ min)</option>
                </select>
              </div>

              {/* IDADE */}
              <div className="flex flex-col gap-2">
                <label className="flex items-center gap-2">
                  <FiCalendar /> Idade
                </label>
                <input
                  type="number"
                  value={idade}
                  onChange={(e) => setIdade(Number(e.target.value))}
                  className="bg-[#2A2A3D] p-2 rounded-lg text-white outline-none"
                  placeholder="Digite sua idade"
                />
              </div>

              <div className="flex justify-between mt-6">
                <button
                  onClick={prev}
                  className="text-gray-400 hover:text-white transition"
                >
                  Voltar
                </button>
                <button
                  onClick={next}
                  className="bg-indigo-600 px-6 py-2 rounded-xl hover:bg-indigo-700 transition"
                >
                  Próximo
                </button>
              </div>
            </motion.div>
          )}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <h2 className="text-lg font-semibold text-white">
                Escolha até 5 Mecânicas
              </h2>

              <input
                type="text"
                value={buscaMecanica}
                onChange={(e) => setBuscaMecanica(e.target.value)}
                placeholder="Buscar mecânica..."
                className="w-full bg-[#2A2A3D] p-2 rounded-lg text-white outline-none"
              />

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-64 overflow-y-auto pr-1">
                {todasMecanicas
                  .filter((m) =>
                    m.nmMecanica
                      .toLowerCase()
                      .includes(buscaMecanica.toLowerCase())
                  )
                  .map((mec) => {
                    const selecionada = mecanicasSelecionadas.includes(
                      mec.nmMecanica
                    );
                    return (
                      <button
                        key={mec.id}
                        onClick={() => {
                          if (selecionada) {
                            setMecanicasSelecionadas(
                              mecanicasSelecionadas.filter(
                                (x) => x !== mec.nmMecanica
                              )
                            );
                          } else if (mecanicasSelecionadas.length < 5) {
                            setMecanicasSelecionadas([
                              ...mecanicasSelecionadas,
                              mec.nmMecanica,
                            ]);
                          }
                        }}
                        className={`rounded-lg px-4 py-2 text-sm font-medium border transition ${
                          selecionada
                            ? "bg-indigo-600 text-white border-indigo-600"
                            : "bg-[#2A2A3D] text-gray-300 border-[#3E3A5E] hover:bg-[#35344a]"
                        }`}
                      >
                        {mec.nmMecanica}
                      </button>
                    );
                  })}
              </div>

              <div className="flex justify-between mt-6">
                <button
                  onClick={prev}
                  className="text-gray-400 hover:text-white transition"
                >
                  Voltar
                </button>
                <button
                  onClick={next}
                  className="bg-indigo-600 px-6 py-2 rounded-xl hover:bg-indigo-700 transition"
                >
                  Próximo
                </button>
              </div>
            </motion.div>
          )}
          {step === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <h2 className="text-lg font-semibold text-white">
                Escolha até 5 Temas
              </h2>

              <input
                type="text"
                value={buscaTema}
                onChange={(e) => setBuscaTema(e.target.value)}
                placeholder="Buscar tema..."
                className="w-full bg-[#2A2A3D] p-2 rounded-lg text-white outline-none"
              />

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-64 overflow-y-auto pr-1">
                {todosTemas
                  .filter((t) =>
                    t.nmTema.toLowerCase().includes(buscaTema.toLowerCase())
                  )
                  .map((tema) => {
                    const selecionado = temasSelecionados.includes(tema.nmTema);
                    return (
                      <button
                        key={tema.id}
                        onClick={() => {
                          if (selecionado) {
                            setTemasSelecionados(
                              temasSelecionados.filter((x) => x !== tema.nmTema)
                            );
                          } else if (temasSelecionados.length < 5) {
                            setTemasSelecionados([
                              ...temasSelecionados,
                              tema.nmTema,
                            ]);
                          }
                        }}
                        className={`rounded-lg px-4 py-2 text-sm font-medium border transition ${
                          selecionado
                            ? "bg-indigo-600 text-white border-indigo-600"
                            : "bg-[#2A2A3D] text-gray-300 border-[#3E3A5E] hover:bg-[#35344a]"
                        }`}
                      >
                        {tema.nmTema}
                      </button>
                    );
                  })}
              </div>

              <div className="flex justify-between mt-6">
                <button
                  onClick={prev}
                  className="text-gray-400 hover:text-white transition"
                >
                  Voltar
                </button>
                <button
                  onClick={finalizar}
                  className="bg-green-500 px-6 py-2 rounded-xl hover:bg-green-600 transition"
                >
                  Finalizar
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
