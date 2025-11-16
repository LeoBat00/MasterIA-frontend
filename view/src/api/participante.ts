import { http } from "./http";
import { endpoints } from "./endpoints";

export type CadastroParticipantePayload = {
  eventoId: number;
  participante: {
    nome: string;
    sobrenome: string;
    genero: string;
    email: string;
    telefone: string;
    perfilParticipante: {
      experiencia: number;
      qntPessoas: number;
      tempJogo: number;
      idade: number;
      temas: { id: number; nmTema: string }[];
      categorias: { id: number; nmCategoria: string }[];
      mecanicas: { id: number; nmMecanica: string }[];
    };
  };
};

export async function cadastrarParticipante(payload: CadastroParticipantePayload) {
  await http.post(endpoints.participante.cadastroEvento, payload);
}
