import { Jogo } from "./jogo";
import { participanteGrupo } from "./participante";

export type Grupo = {
    id: number;
    nmGrupo: string;
    qntMaxima: number;
    descricao: string;
    lojaId: number;
    participantes: participanteGrupo[];
    jogosGrupos: Jogo[];
};