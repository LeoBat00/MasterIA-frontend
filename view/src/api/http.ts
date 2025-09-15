import axios from "axios";
import { useAuthStore } from "../stores/auth";

export const http = axios.create({
  // baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  baseURL: 'https://localhost:7226',
  withCredentials: true, // deixe true se seu back usar cookies httpOnly
});

// token em memória (simples por enquanto)
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

// limpa em 401 e redireciona para login
http.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err?.response?.status === 401) {
      useAuthStore.getState().logout();
     window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);