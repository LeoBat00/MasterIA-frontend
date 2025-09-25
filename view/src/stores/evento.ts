// src/store/auth.ts
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import {filtroEvento, novoEvento} from "../types/evento"
import { validacaoNovoEvento } from "../types/evento";

type EventoState = {
    evento: novoEvento | null;
    validacaoErro?: validacaoNovoEvento;
    exibirFormularioEvento: boolean;
    filtroEvento?: filtroEvento;
    atualizarEvento: (e: novoEvento) => void;
    atualizarFiltroEvento: (f: filtroEvento) => void;
    setExibirFormularioEvento: (v: boolean) => void;
    validarFormulario: () => boolean;
    limparValidacao: () => void;
    clear: () => void;
};



export const useEventoStore = create<EventoState>()(
    devtools(
        (set, get) => ({
            evento: null,
            validacaoErro: undefined,
            exibirFormularioEvento: false,
            atualizarEvento: (e: novoEvento) => set({ evento: e }, false, "atualizarEvento"),
            atualizarFiltroEvento: (f: filtroEvento) => set({ filtroEvento: f }, false, "atualizarFiltroEvento"),
            setExibirFormularioEvento: (v: boolean) => set({ exibirFormularioEvento: v }, false, "setExibirFormularioEvento"),
            validarFormulario: () => {
                const validacaoErro: validacaoNovoEvento = {};
                set({ validacaoErro }, false, "validarFormulario");

                return Object.keys(validacaoErro).length === 0;
            },
            limparValidacao: () => set({ validacaoErro: undefined }, false, "limparValidacao"),
            clear: () => set({ evento: null }, false, "clear"),
        }),
        { name: "Evento" }
    )
);
