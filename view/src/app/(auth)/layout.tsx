"use client";
import AuthLeftPane from "@/components/AuthLeftPane";
import { useAutoDigit } from "@/hooks/useAutoDigit";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function AuthLayout({ children }) {
  const mensagens = [
    "Conectando jogadores de tabuleiro.",
    "Encontre sua próxima aventura.",
    "Descubra grupos perto de você.",
  ];
  const mensagem = useAutoDigit(mensagens, 85, 1500);
  return (
    <>
      <div
        className="
         p-[24px] h-screen rounded-e-2xl
        text-white relative"
      >
        <div className="relative w-full h-full bg-[#070810] p-[8px] md:p-[40px] overflow-clip border border-[#6A4F99] rounded-e-2xl flex flex-col  justify-between">
          <div className="absolute inset-0 bg-[url('/bgLogin.png')] bg-cover bg-center opacity-80"></div>

          <header className="h-auto w-full z-30 hidden md:block">
            <Link
              href="/"
              className="inline-flex z-30 items-center gap-2 text-indigo-500 cursor-pointer border-indigo-500 border-2 px-5 py-2 rounded-full font-medium shadow-md transition hover:brightness-110 hover:shadow-lg mb-6"
            >
              <ArrowLeft size={18} />
              Voltar
            </Link>
          </header>
          <div className="w-full h-full p-[16px] md:p-[0px] flex md:grid md:grid-cols-[1.2fr_0.8fr] z-20">
            <div className="relative z-10 md:block hidden">
              <AuthLeftPane />
            </div>
            <div className=" relative z-10 flex flex-col justify-start items-center w-full h-full mt-[44px] ">
              {children}
            </div>
          </div>

          <div className="w-full items-center flex-col justify-center z-10 hidden md:flex">
            <span className="text-[#7B7B7B] mb-2">{mensagem}</span>
            <span className="w-[320px] border-b-1 border-[#616EFF] "></span>
          </div>
        </div>
      </div>
    </>
  );
}
