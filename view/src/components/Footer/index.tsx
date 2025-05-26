"use client";

import { useEffect, useState } from "react";
import { FiArrowUp } from "react-icons/fi";

export default function Footer() {
  const [showButton, setShowButton] = useState(false);

  // Mostrar botão após rolar um pouco
  useEffect(() => {
    const handleScroll = () => {
      setShowButton(window.scrollY > 200);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="w-full bg-[#1E1E28] border-t border-[#2E2A45] py-6 mt-12 relative">
      <div className="text-center text-sm text-gray-400">
        Repositório GitHub – Universidade de Fortaleza
      </div>


      {showButton && (
        <button
          onClick={scrollToTop}
          className="fixed cursor-pointer bottom-6 right-6 bg-gradient-to-br from-indigo-500 to-purple-600 text-white p-3 rounded-full shadow-lg hover:brightness-110 transition"
          aria-label="Voltar ao topo"
        >
          <FiArrowUp size={20} />
        </button>
      )}
    </footer>
  );
}
