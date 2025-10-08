// src/store/auth.ts
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { http } from "../api/http";
import { endpoints } from "../api/endpoints";

export type Loja = {
    id: number;
    cep: string;
    logradouro: string;
    bairro: string;
    cidade: string;
    uf: string;
    complemento?: string;
    numero?: string;
    status: string;
    hrAbertura?: string;
    hrEncerramento?: string;
};

export type Organizador = {
    id?: number;
    email: string;
    senha: string;
    cpfCnpj: string;
    telefone?: string;
    razaoSocial: string;
    lojas?: Loja[];
};

type OrganizadorState = {
    organizador: Organizador | null;
    loading: boolean;
    error: string | null;
    fetchOrganizador: (id: number) => Promise<void>;
    setOrnanizador: (o: Organizador | null) => void;
    clear: () => void;
};

// Store com nome "OrganizadorStore"
export const useOrganizadorStore = create<OrganizadorState>()(
    devtools(
        (set) => ({
            organizador: null,
            loading: false,
            error: null,
            fetchOrganizador: async (id: number) => {
                try {
                    set({ loading: true, error: null });
                    const { data } = await http.get<Organizador>(
                        endpoints.organizador.getById(id)
                    );
                    set({ organizador: data, loading: false }, false, "fetchOrganizador");
                } catch (error) {
                    set({ loading: false, error: "Erro ao buscar organizador: " + error });
                }
            },
            setOrnanizador: (o) =>
                set({ organizador: o }, false, "setOrganizador"),
            clear: () =>
                set({ organizador: null, loading: false, error: null }, false, "clear"),
        }),
        { name: "Organizador" } // <- nome customizado
    )
);
