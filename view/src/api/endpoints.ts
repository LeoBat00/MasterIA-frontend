import { create } from "domain";

export const endpoints = {
  auth: {
    login: "/Auth/Login",
  },
  organizador: {
    create: "/organizadores",
    getById: (id: number) => `/Organizador/OrganiazadorById?Id=${id}`,
  },
  loja: {
    create: "/Loja",
    update: "/Loja",
    getById: (id: number) => `/Loja/LojaById?Id=${id}`,
  },
};
