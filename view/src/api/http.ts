import axios from "axios";

export const http = axios.create({
  // baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  baseURL: 'https://localhost:7226',
  withCredentials: true, // deixe true se seu back usar cookies httpOnly
});

// token em memória (simples por enquanto)
let ACCESS_TOKEN: string | null = null;
export const setAccessToken = (t?: string) => { ACCESS_TOKEN = t ?? null; };
export const getAccessToken = () => ACCESS_TOKEN;

http.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
