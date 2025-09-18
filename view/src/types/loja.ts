import { Evento } from "./evento";

export type Loja = {
    id?: number;
    cep?: string;
    logradouro?: string;
    bairro?: string;
    cidade?: string;
    uf?: string;
    complemento?: string;
    numero?: string;
    status?: string;
    hrAbertura?: string;
    hrEncerramento?: string;
    organizadorId?: number;
    eventos?: Evento[];
};