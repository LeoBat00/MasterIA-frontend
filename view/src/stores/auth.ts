import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { jwtDecode } from "jwt-decode";
import { http } from "../api/http";
import Cookies from "js-cookie";
import { endpoints } from "../api/endpoints";
import { Organizador } from "./organizador";

export type LoginPayload = { email: string; senha: string };
export type LoginResponse = { token: string };

export type JwtPayload = {
  nameid?: string;
  email?: string;
  razaoSocial?: string;
  exp?: number;
  iat?: number;
  iss?: string;
  aud?: string;
  [k: string]: unknown;
};

type AuthStore = {
  claims: JwtPayload | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (data: Organizador) => Promise<boolean>;
  checkAuth: () => void;
};

export const useAuthStore = create<AuthStore>()(
  devtools(
    (set) => ({
      claims: null,
      loading: false,

      login: async (email: string, senha: string) => {
        try {
          set({ loading: true });
          const { data } = await http.post<{ token: string }>(endpoints.auth.login, { email, senha });
          const { token } = data;

          Cookies.set('token', token, { expires: 7, path: '/' });
          set({ claims: jwtDecode<JwtPayload>(token), loading: false });
          return true;
        } catch (error) {
          console.error("Login failed:", error);
          set({ loading: false });
          return false;
        }
      },

      register: async (data: Organizador) => {
        try {
          set({ loading: true });
          await http.post(endpoints.organizador.create, data);
          set({ loading: false });
          return true;
        } catch (error) {
          console.error("Registration failed:", error);
          set({ loading: false });
          return false;
        }
      },

      logout: () => {
        Cookies.remove('token');
        set({ claims: null });
      },

      checkAuth: () => {
        const token = Cookies.get('token');
        return !!token;
      }
    }),
    { name: "Auth" }
  ),
);
