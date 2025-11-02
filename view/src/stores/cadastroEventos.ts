import { create } from "zustand";
import { devtools } from "zustand/middleware";

export enum EventoPeriodo {
    HOJE = "hoje",
    SEMANA = "semana",
    MES = "mes",
}

export type filtroEventos = {
    codigoEvento?: string;
    inPeriodo?: EventoPeriodo;
}

type CadastroEventosState = {
    cidadeSelecionada?: string;
    filtroEventos?: filtroEventos;
    setFiltroEventos: (filtro: filtroEventos) => void;
    setCidadeSelecionada: (cidade: string) => void;
};

export const useCadastroEventosStore = create<CadastroEventosState>()(
    devtools(
        (set) => ({
            cidadeSelecionada: undefined,
            filtroEventos: {},
            setFiltroEventos: (filtro: filtroEventos) =>
                set({ filtroEventos: filtro }, false, "setFiltroEventos"),
            setCidadeSelecionada: (cidade: string) =>
                set({ cidadeSelecionada: cidade }, false, "setCidadeSelecionada"),
        })
    , {name: "CadastroEventosStore"})
);