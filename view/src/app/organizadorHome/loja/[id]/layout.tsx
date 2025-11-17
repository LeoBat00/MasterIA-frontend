"use client";

import { Breadcrumb } from "@/components/UI/Breadcrumb";
import { usePaginaLojaStore } from "@/stores/paginaLoja";
import LojaGuard from "./LojaGuard";

export default function useLojaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { lojaSelecionada } = usePaginaLojaStore();

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

      <div className="relative mx-auto flex flex-col px-4 py-6 lg:px-8">
        <div id="tituloPaginaLoja" className="mb-6">
          <span className="texto-light text-zinc-200">
            {lojaSelecionada?.nmLoja}
          </span>
          <div className="mt-5">
            <Breadcrumb nomeLoja={lojaSelecionada?.nmLoja} />
          </div>
        </div>

        <LojaGuard>
          <div >{children}</div>
        </LojaGuard>
      </div>
    </div>
  );
}
