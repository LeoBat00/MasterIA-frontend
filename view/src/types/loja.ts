import { Evento } from "./evento";
import { jogoLoja } from "./jogo";

export type Loja = {
    id?: number;
    cep?: string;
    nmLoja?: string;
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
    jogos?: jogoLoja[];
};