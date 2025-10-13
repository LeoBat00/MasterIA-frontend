export interface Categoria {
  id: number;
  nmCategoria: string;
}

export interface Mecanica {
  id: number;
  nmMecanica: string;
}

export interface Tema {
  id: number;
  nmTema: string;
}

export interface Jogo {
  id: number;
  anoNacional?: number;
  anoPublicacao?: number;
  idadeMinima?: number;
  nmJogo?: string;
  qtJogadoresMax?: number;
  qtJogadoresMin?: number;
  thumb?: string;
  tpJogo?: string;
  vlTempoJogo?: number;

  categorias: Categoria[];
  mecanicas: Mecanica[];
  temas: Tema[];
}

export interface jogoLoja {
  jogoId: number;
  nomeJogo: string;
  codigoJogo: string;
  lojaId: number;
  anoPublicacao?: number;
  qtdDisponivel: number;
  copias: number;
  categorias: Categoria[];
  mecanicas: Mecanica[];
  qtdJogadoresMin?: number;
  qtdJogadoresMax?: number;
}
