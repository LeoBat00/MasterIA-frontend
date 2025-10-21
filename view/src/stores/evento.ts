import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { Evento, filtroEvento, novoEvento } from "../types/evento"
import { validacaoNovoEvento } from "../types/evento";
import { http } from "../api/http";
import { endpoints } from "../api/endpoints";

type EventoState = {
    evento: novoEvento | null;
    validacaoErro?: validacaoNovoEvento;
    exibirFormularioEvento: boolean;
    filtroEvento?: filtroEvento;
    eventoSelecionado?: Evento;
    setEventoSelecionado: (e: Evento | undefined) => void;
    atualizarEvento: (e: novoEvento) => void;
    atualizarFiltroEvento: (f: filtroEvento) => void;
    setExibirFormularioEvento: (v: boolean) => void;
    validarFormulario: () => boolean;
    salvarEvento: (e: novoEvento, lojaId: number) => Promise<{ success: true} | { success: false }>;
    getEventoById: (id: number) => Promise<Evento | null>;
    limparValidacao: () => void;
    clear: () => void;
};


export const useEventoStore = create<EventoState>()(
    devtools(
        (set, get) => ({
            evento: null,
            validacaoErro: undefined,
            exibirFormularioEvento: false,
            eventoSelecionado: undefined,
            setEventoSelecionado: (e: Evento | undefined) => set({ eventoSelecionado: e }, false, "setEventoSelecionado"),
            getEventoById: async (id: number): Promise<Evento | null> => {
                try {
                    const response = await http.get<Evento>(endpoints.evento.getById(id));
                    return response.data;
                } catch (error) {
                    console.error("Erro ao buscar evento por ID", error);
                    return null;
                }
            },
            atualizarEvento: (e: novoEvento) => set({ evento: e }, false, "atualizarEvento"),
            atualizarFiltroEvento: (f: filtroEvento) => set({ filtroEvento: f }, false, "atualizarFiltroEvento"),
            setExibirFormularioEvento: (v: boolean) => set({ exibirFormularioEvento: v }, false, "setExibirFormularioEvento"),
            validarFormulario: () => {
                const validacaoErro: validacaoNovoEvento = {};
                const evento = get().evento;

                if (!evento?.nmEvento || evento.nmEvento.trim() === "") {
                    validacaoErro.nomeEvento = "Nome é obrigatório";
                }

                if (!evento?.dtInicio) {
                    validacaoErro.dataInicio = "Data de início é obrigatória";
                }

                if (!evento?.dtFim) {
                    validacaoErro.dataFim = "Data de fim é obrigatória";
                }

                if (!evento?.qtdLimite || evento.qtdLimite <= 0) {
                    validacaoErro.quantidadeMaximaParticipantes = "Quantidade máxima de participantes deve ser maior que 0";
                }

                if (evento?.dtInicio && evento?.dtFim) {
                    const inicio = new Date(evento.dtInicio);
                    const fim = new Date(evento.dtFim);
                    const hoje = new Date();

                    if (inicio > fim) {
                        validacaoErro.dataFim = "Data de fim deve ser maior ou igual a data de início";
                    }

                    if (inicio < hoje) {
                        validacaoErro.dataInicio = "Data de início não pode ser menor que a data atual";
                    }
                }

                set({ validacaoErro }, false, "validarFormulario");

                return Object.keys(validacaoErro).length === 0;
            },
            salvarEvento: async (e: novoEvento, lojaId: number): Promise<{ success: true} | { success: false }> => {
                try {
                    const payload = { ...e, status: 1, lojaId };

                    await http.post(endpoints.evento.create, payload);

                    set({ evento: null, exibirFormularioEvento: false, validacaoErro: undefined }, false, "salvarEvento");
                    return { success: true };
                } catch (error) {
                    console.error("Erro ao salvar evento", error);
                    return { success: false };
                }
            },
            limparValidacao: () => set({ validacaoErro: undefined }, false, "limparValidacao"),
            clear: () => set({ evento: null }, false, "clear"),
        }),
        { name: "Evento" }
    )
);
