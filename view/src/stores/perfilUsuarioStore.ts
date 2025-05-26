// src/stores/perfilUsuarioStore.ts
import { create } from "zustand";

interface PerfilUsuario {
    nome: string;
    sobrenome: string;
    genero: string;
    email: string;
    telefone: string;
    experience: number;
    qntPessoas: string;
    tempoJogo: string;
    idade: string;
    mecanicasSelecionadas: string[];
    temasSelecionados: string[];
    buscaMecanica?: string;
    buscaTema?: string;
}

interface PerfilUsuarioStore {
    perfil: PerfilUsuario;
    setPerfil: (data: Partial<PerfilUsuario>) => void;
    resetPerfil: () => void;
}

export const usePerfilUsuarioStore = create<PerfilUsuarioStore>((set) => ({
    perfil: {
        nome: "",
        sobrenome: "",
        genero: "",
        email: "",
        telefone: "",
        experience: 0,
        qntPessoas: "",
        tempoJogo: "",
        idade: "",
        mecanicasSelecionadas: [],
        temasSelecionados: [],
    },
    setPerfil: (data) => set((state) => ({ perfil: { ...state.perfil, ...data } })),
    resetPerfil: () =>
        set({
            perfil: {
                nome: "",
                sobrenome: "",
                genero: "",
                email: "",
                telefone: "",
                experience: 0,
                qntPessoas: "",
                tempoJogo: "",
                idade: "",
                mecanicasSelecionadas: [],
                temasSelecionados: [],
            },
        }),
}));
