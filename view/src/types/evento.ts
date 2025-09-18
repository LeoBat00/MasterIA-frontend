export type statusEvento = "Ativo" | "EmAndamento" | "Encerrado" | "Desativado";


export type Evento = {
    id: number;
    nmEvento: string;
    dtInicio: string;
    dtFim: string;
    status: statusEvento;
    qtdLimite?: number;
};