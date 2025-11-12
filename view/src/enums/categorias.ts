export const CATEGORIAS_MAP = {
  1: "Miniaturas",
  2: "Jogo Assimétrico",
  3: "Dungeon Crawler",
  4: "Jogo de Dados",
  5: "Expansão ou Suplemento",
  6: "Livro-jogo",
  7: "4x",
  8: "Jogo de Cartas",
  9: "Jogo de Guerra",
  10: "Integrado com Aplicativo",
  11: "Estratégia Abstrata",
  12: "Quebra-Cabeça",
  13: "Colecionável",
  14: "Jogo de Entrada",
  15: "Carteado",
  16: "Jogo Festivo",
  17: "Destreza",
  18: "Imprima e Jogue",
  19: "Trivia",
} as const;

export type CategoriaId = keyof typeof CATEGORIAS_MAP;

export const CATEGORIAS_LIST = Object.entries(CATEGORIAS_MAP).map(
  ([id, nome]) => ({ id: Number(id), nome })
);
