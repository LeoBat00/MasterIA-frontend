// src/store/auth.ts
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { http } from "../api/http";
import { endpoints } from "../api/endpoints";

export type Loja = {
    id?: number;
    cep?: string;
    logradouro?: string;
    bairro?: string;
    cidade?: string;
    uf?: string;
    complemento?: string;
    numero?: string;
    status?: string;
    hrAbertura?: string;
    hrEncerramento?: string;
    organizadorId?: number;
};

export type validacaoNovaLoja = {
    cep?: string;
    cidade?: string;
    uf?: string;
    logradouro?: string;
    bairro?: string;
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
                if (get().loja?.cep && get().loja?.cep?.length !== 8) validacaoErro.cep = "CEP inválido";
                if (!get().loja?.cidade) validacaoErro.cidade = "Cidade é obrigatória";
                if (!get().loja?.uf) validacaoErro.uf = "UF é obrigatório";
                if (!get().loja?.logradouro) validacaoErro.logradouro = "Logradouro é obrigatório";
                if (!get().loja?.bairro) validacaoErro.bairro = "Bairro é obrigatório";
                set({ validacaoErro }, false, "validarFormulario");

                return Object.keys(validacaoErro).length === 0;
            },
            limparValidacao: () => set({ validacaoErro: undefined }, false, "limparValidacao"),
            saveLoja: async (l: Loja, idOrganizador: number): Promise<{ success: true; data: Loja } | { success: false; error: any }> => {
                try {

                    const payload = { ...l, organizadorId: idOrganizador, complemento:"obrigatorio" };
                    const { data } = await http.post<Loja>(endpoints.loja.create, payload);
                    console.log("Loja cadastrada com sucesso", data);
                    set({ loja: null, exibirFormularioLoja: false, validacaoErro: undefined }, false, "saveLoja");
                    debugger
                    return { success: true, data };
                } catch (error) {
                    console.error("Erro ao salvar loja", error);
                    return { success: false, error }; // <- erro
                }
            },
            clear: () => set({ loja: null }, false, "clearLoja"),
        }),
        { name: "Loja" }
    )
);
