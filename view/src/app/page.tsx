"use client";

import Header from "@/components/Header";
import Link from "next/link";
import Image from "next/image";
import { FiCpu, FiSmile, FiClipboard, FiZap } from "react-icons/fi";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";

import CidadeModal from "@/components/ModalPrincipal"; // Certifique-se de usar a letra maiúscula
import { useState } from "react";
export default function Home() {
  const [modalOpen, setModalOpen] = useState(false);
  return (
    <div className="min-h-screen flex flex-col items-center font-sans text-gray-100 bg-gradient-to-br from-[#0D0D12] to-[#1A162A]">
      <div className="w-full">
        <Header />
        <main className="flex flex-col items-center justify-center flex-grow p-6 sm:p-16 w-full">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-gradient-to-tr from-indigo-900 via-[#2F2B43] to-purple-800 border border-[#3E3A5E] p-8 sm:p-12 rounded-xl flex flex-col sm:flex-row items-center gap-10 max-w-6xl w-full shadow-xl"
          >
            <div className="flex flex-col gap-5 max-w-xl text-center sm:text-left">
              <motion.h2
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="text-4xl sm:text-5xl font-bold leading-tight text-white"
              >
                Encontre Mesas de Tabuleiro
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="text-base sm:text-lg text-gray-300"
              >
                Descubra grupos e jogos que combinam com seu estilo. Participe
                de partidas épicas perto de você.
              </motion.p>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="flex gap-4 flex-wrap justify-center sm:justify-start"
              >
                <button
                  //onClick={() => setModalOpen(true)}
                  className="bg-yellow-400 cursor-not-allowed text-black font-semibold px-6 py-2 rounded-xl transition hover:bg-yellow-300"
                >
                  Procurar Mesas
                </button>

                <Link
                    href="#"
                  className="border cursor-not-allowed border-indigo-400 text-indigo-200 px-6 py-2 rounded-xl transition hover:bg-indigo-600 hover:text-white"
                >
                  Criar Conta
                </Link>

                <Link href="/gerarRecomendacao" className="flex items-center gap-2 cursor-pointer text-indigo-200 px-6 py-2 rounded-xl transition hover:bg-indigo-600 hover:text-white">
                  <FiZap className="text-lg" />
                  Gerar recomendação
                </Link>
              </motion.div>
            </div>
            
            <motion.div
              animate={{
                y: [0, -10, 0],
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="w-full sm:w-[400px] h-auto rounded-xl overflow-hidden shadow-lg flex items-center justify-center"
            >
              <Image
                src="/imagemprincipal.png"
                alt="Imagem principal"
                width={400}
                height={300}
                className="object-contain w-full h-auto"
              />
            </motion.div>
          </motion.div>
        </main>

        <section className="text-center text-xl sm:text-2xl font-light italic mt-4 px-4 mb-10">
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="bg-gradient-to-r from-indigo-200 via-indigo-300 to-indigo-300/30 bg-clip-text text-transparent"
          >
            Sua próxima aventura começa aqui
          </motion.span>
        </section>

        <section className="w-full px-6 sm:px-16 pb-20">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {[
              {
                icon: <FiCpu />,
                title: "Tecnologia com IA",
                desc: "Encontramos a mesa ideal para você usando inteligência artificial de verdade.",
                gradient: "from-purple-500 to-indigo-500",
              },
              {
                icon: <FiSmile />,
                title: "Design Amigável",
                desc: "Interface intuitiva, feita para jogadores de todos os níveis se sentirem em casa.",
                gradient: "from-indigo-400 to-purple-400",
              },
              {
                icon: <FiClipboard />,
                title: "Gestão Simplificada",
                desc: "Gerencie suas mesas, jogos, reservas e jogadores com facilidade.",
                gradient: "from-purple-600 to-indigo-600",
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 * index }}
                viewport={{ once: true }}
                className="bg-[#1E1B2E] border border-[#3E3A5E] rounded-xl p-6 shadow-lg hover:shadow-indigo-600/30 transition"
              >
                <div
                  className={`flex items-center justify-center w-14 h-14 mb-4 rounded-full bg-gradient-to-br ${item.gradient} text-white text-2xl`}
                >
                  {item.icon}
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-400">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>
      </div>
      <CidadeModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
      <Footer />
    </div>
  );
}
