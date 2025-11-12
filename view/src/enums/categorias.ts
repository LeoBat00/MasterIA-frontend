export const CATEGORIAS = {
  MINIATURAS: { id: 1, descricao: "Miniaturas" },
  JOGO_ASSIMETRICO: { id: 2, descricao: "Jogo Assimétrico" },
  DUNGEON_CRAWLER: { id: 3, descricao: "Dungeon Crawler" },
  JOGO_DE_DADOS: { id: 4, descricao: "Jogo de Dados" },
  EXPANSAO_OU_SUPLEMENTO: { id: 5, descricao: "Expansão ou Suplemento" },
  LIVRO_JOGO: { id: 6, descricao: "Livro-jogo" },
  QUATRO_X: { id: 7, descricao: "4x" },
  JOGO_DE_CARTAS: { id: 8, descricao: "Jogo de Cartas" },
  JOGO_DE_GUERRA: { id: 9, descricao: "Jogo de Guerra" },
  INTEGRADO_COM_APLICATIVO: { id: 10, descricao: "Integrado com Aplicativo" },
  ESTRATEGIA_ABSTRATA: { id: 11, descricao: "Estratégia Abstrata" },
  QUEBRA_CABECA: { id: 12, descricao: "Quebra-Cabeça" },
  COLECIONAVEL: { id: 13, descricao: "Colecionável" },
  JOGO_DE_ENTRADA: { id: 14, descricao: "Jogo de Entrada" },
  CARTEADO: { id: 15, descricao: "Carteado" },
  JOGO_FESTIVO: { id: 16, descricao: "Jogo Festivo" },
  DESTREZA: { id: 17, descricao: "Destreza" },
  IMPRIMA_E_JOGUE: { id: 18, descricao: "Imprima e Jogue" },
  TRIVIA: { id: 19, descricao: "Trivia" },
} as const;

export type CategoriaKey = keyof typeof CATEGORIAS;
export type CategoriaInfo = (typeof CATEGORIAS)[CategoriaKey];
export const CATEGORIAS_LIST = Object.values(CATEGORIAS);
