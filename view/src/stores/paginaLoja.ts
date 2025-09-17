import { create } from "zustand";
import { Loja } from "./loja";

type LojaState = {
  lojaSelecionada: Loja | null;
  setLoja: (loja: Loja) => void;
  clearLoja: () => void;
};

export const usePaginaLojaStore = create<LojaState>((set) => ({
  lojaSelecionada: null,
  setLoja: (loja) => set({ lojaSelecionada: loja }),
  clearLoja: () => set({ lojaSelecionada: null }),
}));
