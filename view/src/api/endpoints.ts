
export const endpoints = {
  auth: {
    login: "/Auth/Login",
  },
  organizador: {
    create: "/Organizador",
    getById: (id: number) => `/Organizador/OrganiazadorById?Id=${id}`,
  },
  loja: {
    create: "/Loja",
    update: "/Loja",
    getById: (id: number) => `/Loja/LojaById?Id=${id}`,
  },
  evento: {
    create: "/Evento",
    update: "/Evento", 
    getById: (id: number) => `/Evento/EventoById?Id=${id}`,
  },
  jogo: {
    getPaginado: "/Jogo/ListarPaginado",
    getPaginadoComLoja:"Jogo/ListarPaginadoNotInLoja"
  }
};
