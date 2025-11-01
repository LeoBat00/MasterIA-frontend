import { Grupo } from "./grupo";
import { jogoEvento } from "./jogo";

export type statusEvento = "Ativo" | "EmAndamento" | "Encerrado" | "Desativado";

export type novoEvento = {
    nmEvento?: string;
    dtInicio?: string;
    dtFim?: string;
    status?: statusEvento;
    qtdLimite?: number;
    jogosEvento?: jogoEvento[];
}

export type Evento = {
    id: number;
    nmEvento: string;
    cdEvento: string;
    dtInicio: string;
    dtFim: string;
    status: statusEvento;
    qtdLimite?: number;
    lojaId: number;
    jogos: jogoEvento[];
    grupos: Grupo[];
};

export type validacaoNovoEvento = {
    nomeEvento?: string;
    dataInicio?: string;
    dataFim?: string;
    quantidadeMaximaParticipantes?: string;
}

export type filtroEvento = {
    nomeEvento?: string;
    dataInicio?: Date;
    dataFim?: Date;
    ordem?: "maisRecente" | "maisAntigo" | "A-Z" | "Z-A";
    status?: string;
    codigoEvento?: string;
}