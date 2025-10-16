// src/store/auth.ts
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { http } from "../api/http";
import { endpoints } from "../api/endpoints";
import { Loja } from "../types/loja"

export type validacaoNovaLoja = {
    cep?: string;
    cidade?: string;
    uf?: string;
    logradouro?: string;
    bairro?: string;
    nmLoja?: string;
}

type LojaState = {
    loja: Loja | null;
    validacaoErro?: validacaoNovaLoja;
    exibirFormularioLoja: boolean;
    atualizarLoja: (l: Loja) => void;
    setExibirFormularioLoja: (v: boolean) => void;
    validarFormulario: () => boolean;
    limparValidacao: () => void;
    saveLoja: (l: Loja, organizadorId: number) => Promise<{ success: true; data: Loja } | { success: false; error: any }>;
    updateLoja: (l: Loja) => Promise<{ success: true; data: Loja } | { success: false; error: any }>;
    clear: () => void;
};

export const useLojaStore = create<LojaState>()(
    devtools(
        (set, get) => ({
            loja: null,
            loading: false,
            error: null,
            exibirFormularioLoja: false,
            atualizarLoja: (l: Loja) => set({ loja: l }, false, "atualizarLoja"),
            setExibirFormularioLoja: (v: boolean) => set({ exibirFormularioLoja: v }, false, "setExibirFormularioLoja"),
            validarFormulario: () => {
                const validacaoErro: validacaoNovaLoja = {};
                if (!get().loja?.cep) validacaoErro.cep = "CEP é obrigatório";
                if (!get().loja?.nmLoja) validacaoErro.nmLoja = "Nome da loja é obrigatório";
                if (get().loja?.cep && get().loja?.cep?.length !== 8) validacaoErro.cep = "CEP inválido";
                if (!get().loja?.cidade) validacaoErro.cidade = "Cidade é obrigatória";
                if (!get().loja?.uf) validacaoErro.uf = "UF é obrigatório";
                if (get().loja?.uf && get().loja?.uf?.length !== 2) validacaoErro.uf = "UF inválido";
                if (!get().loja?.logradouro) validacaoErro.logradouro = "Logradouro é obrigatório";
                if (!get().loja?.bairro) validacaoErro.bairro = "Bairro é obrigatório";
                set({ validacaoErro }, false, "validarFormulario");

                return Object.keys(validacaoErro).length === 0;
            },
            limparValidacao: () => set({ validacaoErro: undefined }, false, "limparValidacao"),
            saveLoja: async (l: Loja, idOrganizador: number): Promise<{ success: true; data: Loja } | { success: false; error: any }> => {
                try {

                    const payload = { ...l, organizadorId: idOrganizador, complemento: "obrigatorio" };
                    const { data } = await http.post<Loja>(endpoints.loja.create, payload);
                    set({ loja: null, exibirFormularioLoja: false, validacaoErro: undefined }, false, "saveLoja");
                    return { success: true, data };
                } catch (error) {
                    return { success: false, error }; // <- erro
                }
            },
            updateLoja: async (l: Loja): Promise<{ success: true; data: Loja } | { success: false; error: any }> => {
                try {
                    const { data } = await http.put<Loja>(endpoints.loja.update, l);
                    set({ loja: null, exibirFormularioLoja: false, validacaoErro: undefined }, false, "updateLoja");
                    return { success: true, data };
                } catch (error) {
                    return { success: false, error };
                }
            },
            clear: () => set({ loja: null }, false, "clearLoja"),
        }),
        { name: "Loja" }
    )
);
