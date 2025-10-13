import axios from "axios";
import { useAuthStore } from "../stores/auth";
import { useMessageStore } from "../stores/useMessageStore";

export const http = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  withCredentials: true,
});

// token em memória
let ACCESS_TOKEN: string | null = null;
export const setAccessToken = (t?: string) => { ACCESS_TOKEN = t ?? null; };
export const getAccessToken = () => ACCESS_TOKEN;

// injeta Bearer antes de cada request
http.interceptors.request.use((config) => {
  const { token, isExpired, logout } = useAuthStore.getState();
  if (token) {
    if (isExpired()) {
      logout();
    } else {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// respostas globais
http.interceptors.response.use(
  (res) => {
    // dispara mensagem de sucesso se for POST/PUT/DELETE (opcional)
    if (["post", "put", "delete"].includes(res.config.method ?? "")) {
      useMessageStore
        .getState()
        .addMessage({
          type: "success",
          text: "Operação realizada com sucesso!",
        });
    }
    return res;
  },
  (err) => {
    const status = err?.response?.status;

    if (status === 401 || status === 403) {
      useAuthStore.getState().logout();
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
    } else if (status >= 500) {
      useMessageStore
        .getState()
        .addMessage({
          type: "error",
          text: "Servidor indisponível. Tente novamente mais tarde.",
        });
    } else if (status >= 400) {
      useMessageStore
        .getState()
        .addMessage({
          type: "error",
          text: err?.response?.data?.message || "Erro na requisição.",
        });
    }

    return Promise.reject(err);
  }
);
