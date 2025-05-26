"use client";
import { FiArrowLeft, FiArrowRight } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useRouter } from 'next/navigation';

interface CidadeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const cidades = [
  "Fortaleza",
  "São Paulo",
  "Rio de Janeiro",
  "Curitiba",
  "Salvador",
];

export default function CidadeModal({ isOpen, onClose }: CidadeModalProps) {
  const [search, setSearch] = useState("");
  const router = useRouter();

  const filtradas = cidades.filter((c) =>
    c.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.8 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black z-40"
          />

          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 flex items-center justify-center"
          >
            <div className="relative bg-[#1E1E28] border border-[#3E3A5E] rounded-xl w-full max-w-md mx-auto p-6 shadow-lg">
              <button
                onClick={onClose}
                className="absolute top-4 left-4 text-gray-300 hover:text-white"
              >
                <FiArrowLeft size={20} />
              </button>

              <h2 className="text-lg font-semibold text-white text-center mb-4">
                Selecione sua cidade
              </h2>

              <input
                type="text"
                placeholder="Digite sua cidade..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full px-4 py-2 mb-4 rounded-lg bg-[#2A2A3D] text-white placeholder-gray-400 outline-none border border-[#3E3A5E] focus:ring-2 focus:ring-indigo-500"
              />

              <div className="space-y-2 max-h-60 overflow-y-auto">
                {filtradas.length > 0 ? (
                  filtradas.map((cidade) => (
                    <button
                      key={cidade}
                      onClick={() => {
                        onClose();
                        router.push(
                          `/cidade/${encodeURIComponent(cidade.toLowerCase())}`
                        );
                      }}
                      className="w-full cursor-pointer flex items-center justify-between bg-[#2F2B43] hover:bg-indigo-600 text-white px-4 py-2 rounded-lg transition"
                    >
                      <span>{cidade}</span>
                      <FiArrowRight />
                    </button>
                  ))
                ) : (
                  <p className="text-sm text-gray-400 text-center">
                    Nenhuma cidade encontrada.
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
