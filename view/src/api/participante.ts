import { http } from "./http";
import { endpoints } from "./endpoints";
import { Categoria, Mecanica, Tema } from "@/types/jogo";

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

export type RecomendacaoJogo = {
  id_mysql: number;
  nmJogo: string;
  semantic_score: number;
  popularity_score: number;
  thumb: string;
  categorias?: Categoria[];
  mecanicas?: Mecanica[];
  temas?: Tema[];
};

export type RecomendacaoPerfilResponse = {
  recommendations: RecomendacaoJogo[];
  query: string;
};

export async function getRecomendacaoPerfil(participanteId: number) {
  const { data } = await http.get<RecomendacaoPerfilResponse>(
    endpoints.participante.recomendacaoPerfil(participanteId)
  );
  return data;
}
