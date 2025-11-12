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
    prefereSorteOuEstrategia: string;
    prefereCompetirOuCooperar: string;
    curteNegociar: string;
    gostaDeCriar: string;
    prefereRitmoJogo: string;
    gostaDeDesafiosFisicos: string;
    gostaDeMagia: string;
    prefereUniversoTecnologico: string;
    curteAdministracao: string;
    prefereJogosEngracados: string;
    gostaDeBatalhas: string;
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
        prefereSorteOuEstrategia: "",
        prefereCompetirOuCooperar: "",
        curteNegociar: "",
        gostaDeCriar: "",
        prefereRitmoJogo: "",
        gostaDeDesafiosFisicos: "",
        gostaDeMagia: "",
        prefereUniversoTecnologico: "",
        curteAdministracao: "",
        prefereJogosEngracados: "",
        gostaDeBatalhas: "",
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
                prefereSorteOuEstrategia: "",
                prefereCompetirOuCooperar: "",
                curteNegociar: "",
                gostaDeCriar: "",
                prefereRitmoJogo: "",
                gostaDeDesafiosFisicos: "",
                gostaDeMagia: "",
                prefereUniversoTecnologico: "",
                curteAdministracao: "",
                prefereJogosEngracados: "",
                gostaDeBatalhas: "",
            },
        }),
}));
