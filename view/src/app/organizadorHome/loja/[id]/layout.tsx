'use client';

import { Breadcrumb } from "@/components/UI/Breadcrumb";
import { usePaginaLojaStore } from "@/stores/paginaLoja";

export default function useLojaLayout({ children }: { children: React.ReactNode }) {

    const { lojaSelecionada } = usePaginaLojaStore();


    return (
        <div className="min-h-screen flex flex-col pb-8">

            <div id="tituloPaginaLoja" className="mb-6">
                <span className="texto-light">{lojaSelecionada?.nmLoja}</span>
                <div className="mt-5">
                    <Breadcrumb nomeLoja={lojaSelecionada?.nmLoja} />
                </div>
            </div>



            <main className="">{children}</main>
        </div>
    );
}