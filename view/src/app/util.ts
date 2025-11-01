import { Loja } from "../types/loja";
import { Evento } from "../types/evento";
import { statusEvento } from "../types/evento";

export const obterEnderecoCompleto = (loja: Loja) => {
    return `${loja.logradouro}, ${loja.numero} - ${loja.bairro}, ${loja.cidade} - ${loja.uf}, ${loja.cep}`;
}

export const formatarData = (dataStr: string): string => {
    const data = new Date(dataStr);
    return data.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
}


export function calcularStatus(evento: Evento): statusEvento {
    if (!evento.status) return "Desativado";
    const agora = new Date();
    const inicio = new Date(evento.dtInicio);
    const fim = new Date(evento.dtFim);

    if (agora < inicio) return "Ativo";
    if (agora >= inicio && agora <= fim) return "EmAndamento";
    return "Encerrado";
}

export function getCorStatusEvento(status: statusEvento | undefined): string {
    switch (status) {
        case "Ativo":
            return "var(--cor-status-ativo)";
        case "EmAndamento":
            return "var(--cor-status-em-andamento)";
        case "Encerrado":
            return "var(--cor-status-encerrado)";
        case "Desativado":
            return "var(--cor-status-desativado)";
        default:
            return "";
    }
}


export function tempoRestante(evento: Evento, status: statusEvento): string {
    const agora = new Date();
    const inicio = new Date(evento.dtInicio);
    const fim = new Date(evento.dtFim);

    if (status === "Desativado") return "Desativado";
    if (status === "Encerrado") return "Encerrado";
    if (status === "EmAndamento") {
        const diff = fim.getTime() - agora.getTime();
        const horas = Math.ceil(diff / (1000 * 60 * 60));
        return `Termina em ${horas}h`;
    }
    if (status === "Ativo") {
        const diff = inicio.getTime() - agora.getTime();
        const dias = Math.ceil(diff / (1000 * 60 * 60 * 24));
        return `${dias} ${dias === 1 ? "Dia" : "Dias"}`;
    }
    return "";
}