'use client';

import { useState } from 'react';
import { FiUser, FiMail, FiPhone, FiSliders, FiUsers, FiClock, FiCalendar } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

export default function gerarRecomendacao() {
  const [step, setStep] = useState(1);
  const totalSteps = 2;

  const next = () => setStep((prev) => Math.min(prev + 1, totalSteps));
  const prev = () => setStep((prev) => Math.max(prev - 1, 1));

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
                <label className="flex items-center gap-2"><FiUser /> Nome</label>
                <input type="text" className="bg-[#2A2A3D] p-2 rounded-lg text-white outline-none" />
              </div>

              <div className="flex flex-col gap-2">
                <label className="flex items-center gap-2"><FiUser /> Sobrenome</label>
                <input type="text" className="bg-[#2A2A3D] p-2 rounded-lg text-white outline-none" />
              </div>

              <div className="flex flex-col gap-2">
                <label className="flex items-center gap-2"><FiSliders /> Gênero</label>
                <select className="bg-[#2A2A3D] p-2 rounded-lg text-white outline-none">
                  <option value="">Selecione</option>
                  <option value="M">Masculino</option>
                  <option value="F">Feminino</option>
                  <option value="O">Outro</option>
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <label className="flex items-center gap-2"><FiMail /> E-mail</label>
                <input type="email" className="bg-[#2A2A3D] p-2 rounded-lg text-white outline-none" />
              </div>

              <div className="flex flex-col gap-2">
                <label className="flex items-center gap-2"><FiPhone /> Telefone</label>
                <input type="tel" className="bg-[#2A2A3D] p-2 rounded-lg text-white outline-none" />
              </div>

              <div className="flex justify-end mt-6">
                <button onClick={next} className="bg-indigo-600 px-6 py-2 rounded-xl hover:bg-indigo-700 transition">
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
              className="space-y-4"
            >
              <div className="flex flex-col gap-2">
                <label className="flex items-center gap-2"><FiSliders /> Nível de Experiência</label>
                <input type="number" className="bg-[#2A2A3D] p-2 rounded-lg text-white outline-none" />
              </div>

              <div className="flex flex-col gap-2">
                <label className="flex items-center gap-2"><FiUsers /> Quantidade de Pessoas com quem joga</label>
                <input type="number" className="bg-[#2A2A3D] p-2 rounded-lg text-white outline-none" />
              </div>

              <div className="flex flex-col gap-2">
                <label className="flex items-center gap-2"><FiClock /> Tempo Médio de Jogo (min)</label>
                <input type="number" className="bg-[#2A2A3D] p-2 rounded-lg text-white outline-none" />
              </div>

              <div className="flex flex-col gap-2">
                <label className="flex items-center gap-2"><FiCalendar /> Idade</label>
                <input type="number" className="bg-[#2A2A3D] p-2 rounded-lg text-white outline-none" />
              </div>

              <div className="flex justify-between mt-6">
                <button onClick={prev} className="text-gray-400 hover:text-white transition">Voltar</button>
                <button className="bg-green-500 px-6 py-2 rounded-xl hover:bg-green-600 transition">
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
