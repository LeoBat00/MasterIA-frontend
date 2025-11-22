import { CATEGORIAS_LIST } from "@/enums/categorias";
import { MECANICAS_LIST } from "@/enums/mecanicas";
import { TEMAS_LIST } from "@/enums/temas";
import { Categoria, Mecanica, Tema, jogoEvento, Jogo } from "@/types/jogo";

const categoriaById = new Map<number, Categoria>(
  CATEGORIAS_LIST.map((c) => [c.id, { id: c.id, nmCategoria: c.descricao }])
);

const mecanicaById = new Map<number, Mecanica>(
  MECANICAS_LIST.map((m) => [m.id, { id: m.id, nmMecanica: m.descricao }])
);

const temaById = new Map<number, Tema>(
  TEMAS_LIST.map((t) => [t.id, { id: t.id, nmTema: t.descricao }])
);

const mapCategorias = (ids?: number[], existentes?: Categoria[]): Categoria[] => {
  if (existentes && existentes.length > 0) return existentes;
  if (!ids || ids.length === 0) return [];
  return ids.map((id) => categoriaById.get(id) ?? { id, nmCategoria: String(id) });
};

const mapMecanicas = (ids?: number[], existentes?: Mecanica[]): Mecanica[] => {
  if (existentes && existentes.length > 0) return existentes;
  if (!ids || ids.length === 0) return [];
  return ids.map((id) => mecanicaById.get(id) ?? { id, nmMecanica: String(id) });
};

const mapTemas = (ids?: number[], existentes?: Tema[]): Tema[] => {
  if (existentes && existentes.length > 0) return existentes;
  if (!ids || ids.length === 0) return [];
  return ids.map((id) => temaById.get(id) ?? { id, nmTema: String(id) });
};

/**
 * Normaliza taxonomias de um jogo (evento ou loja) mapeando ids -> objetos nomeados.
 */
export function mapGameIdsToEnum<T extends jogoEvento | Jogo>(jogo: T): T {
  return {
    ...jogo,
    categorias: mapCategorias(jogo.categoriasIds, (jogo as any).categorias),
    mecanicas: mapMecanicas(jogo.mecanicasIds, (jogo as any).mecanicas),
    temas: mapTemas(jogo.temasIds, (jogo as any).temas),
  };
}
