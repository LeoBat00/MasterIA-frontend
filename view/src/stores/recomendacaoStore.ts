import { create } from 'zustand';

type Jogo = {
  id: number;
  nmJogo: string;
  thumb: string;
  idadeMinima: number;
  qtJogadoresMin: number;
  qtJogadoresMax: number;
  vlTempoJogo: number;
  anoPublicacao: number;
  anoNacional?: number;
  tpJogo: string;
  artistas: string[];
  designers: string[];
  categorias: string[];
  mecanicas: string[];
  temas: string[];
};


type RecomendacaoState = {
  resumo: string;
  jogos: Jogo[];
  setResumo: (resumo: string) => void;
  setJogos: (jogos: Jogo[]) => void;
  reset: () => void;
};

export const useRecomendacaoStore = create<RecomendacaoState>((set) => ({
  resumo: '',
  jogos: [],
  setResumo: (resumo) => set({ resumo }),
  setJogos: (jogos) => set({ jogos }),
  reset: () => set({ resumo: '', jogos: [] }),
}));
