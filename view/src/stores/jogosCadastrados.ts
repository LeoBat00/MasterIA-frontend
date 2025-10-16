// src/store/auth.ts
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { http } from "../api/http";
import { endpoints } from "../api/endpoints";
import { filtroBuscaPaginadaJogo, Jogo } from "../types/jogo";


type PaginacaoResponse<T> = {
    totalItens: number;
    paginaAtual: number;
    totalPaginas: number;
    itens: T[];
};

type jogosCadastradoState = {
    jogos: Jogo[] | null;
    paginaAtual: number;
    tamanhoPagina: number;
    totalItens: number;
    totalPaginas: number;
    filtroBusca?: filtroBuscaPaginadaJogo;
    fetchJogosPaginado: (
        page: number,
        pageSize: number,
        filtro?: filtroBuscaPaginadaJogo
    ) => Promise<{ success: true; data: Jogo[] } | { success: false; error: any }>;
    clear: () => void;
};

export const useJogosCadastradoStore = create<jogosCadastradoState>()(
    devtools(
        (set, get) => ({
            jogos: null,
            paginaAtual: 1,
            tamanhoPagina: 10,
            totalItens: 0,
            totalPaginas: 0,
            async fetchJogosPaginado(page: number, pageSize: number, filtro?: filtroBuscaPaginadaJogo) {
                try {
                    
                    const filtroFinal = filtro ? filtro : { ...get().filtroBusca }

                    const endPointFinal = filtroFinal?.lojaId ? endpoints.jogo.getPaginadoComLoja : endpoints.jogo.getPaginado

                    const { data } = await http.post<PaginacaoResponse<Jogo>>(
                        `${endPointFinal}?pagina=${page}&tamanhoPagina=${pageSize}`,
                        filtroFinal
                    );

                    set(
                        {
                            jogos: data.itens,
                            paginaAtual: data.paginaAtual,
                            tamanhoPagina: pageSize,
                            totalItens: data.totalItens,
                            totalPaginas: data.totalPaginas,
                            filtroBusca: filtroFinal,
                        },
                        false,
                        "fetchJogosPaginado"
                    );

                    return { success: true, data: data.itens };
                } catch (error) {
                    console.error("Erro ao carregar jogos", error);
                    return { success: false, error };
                }
            },
            clear: () =>
                set(
                    {
                        jogos: null,
                        paginaAtual: 1,
                        tamanhoPagina: 10,
                        totalItens: 0,
                        totalPaginas: 0,
                    },
                    false,
                    "clearStoreJogosCadastrados"
                ),
        }),
        { name: "jogosCadastrados" }
    )
);
