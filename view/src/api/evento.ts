import { http } from "./http";
import { endpoints } from "./endpoints";

export type CidadeDisponivel = {
  cidade: string;
  qtdEventos: number;
};

export async function getCidadesDisponiveis() {
  const { data } = await http.get<CidadeDisponivel[]>(
    endpoints.evento.getCidadesDisponiveis
  );
  return data;
}

