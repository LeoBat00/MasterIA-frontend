import { create } from "zustand";
import { Loja } from "./loja";

type LojaState = {
  loja: Loja | null;
  setLoja: (loja: Loja) => void;
  clearLoja: () => void;
};

export const usePaginaLojaStore = create<LojaState>((set) => ({
  loja: null,
  setLoja: (loja) => set({ loja }),
  clearLoja: () => set({ loja: null }),
}));
