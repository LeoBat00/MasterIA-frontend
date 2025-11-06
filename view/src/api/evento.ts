import { http } from "./http";
import { endpoints } from "./endpoints";
import type { EventoAtivo } from "../types/evento";

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

export async function getEventosAtivos() {
  const { data } = await http.get<EventoAtivo[]>(
    endpoints.evento.getEventosAtivos
  );
  return data;
}
