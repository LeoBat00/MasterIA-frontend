import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { Loja } from "../types/loja";
import { http } from "../api/http";
import { endpoints } from "../api/endpoints";
import { filtroBuscaPaginadaJogo } from "../types/jogo";

type LojaResponse =
    | { success: true; data: Loja }
    | { success: false; error: unknown };

type LojaState = {
    lojaSelecionada: Loja | null;
    filtroBuscaJogosBanco?: filtroBuscaPaginadaJogo;
    isLoading: boolean;
    setIsLoading: (loading: boolean) => void;
    atualizarFiltroBusca: (f: filtroBuscaPaginadaJogo) => void;
    limparFiltroBusca: () => void;
    setLoja: (loja: Loja) => void;
    clearLoja: () => void;
    fetchLoja: (id: number) => Promise<LojaResponse>;
};

export const usePaginaLojaStore = create<LojaState>()(
    devtools(
        (set) => ({
            lojaSelecionada: null,
            filtroBuscaJogosBanco: undefined,
            isLoading: false,
            setIsLoading: (loading: boolean) =>
                set({ isLoading: loading }, false, "setIsLoading"),
            atualizarFiltroBusca: (f: filtroBuscaPaginadaJogo) =>
                set({ filtroBuscaJogosBanco: f }, false, "atualizarFiltroBusca"),
            limparFiltroBusca: () =>
                set({ filtroBuscaJogosBanco: undefined }, false, "limparFiltroBusca"),
            setLoja: (loja) =>
                set({ lojaSelecionada: loja }, false, "setLoja"),

            clearLoja: () =>
                set({ lojaSelecionada: null }, false, "clearLoja"),

            fetchLoja: async (id: number) => {
                try {
                    const { data } = await http.get<Loja>(
                        endpoints.loja.getById(id)
                    );

                    set({ lojaSelecionada: data }, false, "fetchLoja");

                    return { success: true, data };
                } catch (error) {
                    console.error("Erro ao buscar loja", error);
                    return { success: false, error };
                }
            },
        }),
        { name: "paginaLoja" }
    )
);
