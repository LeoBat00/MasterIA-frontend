import { create } from "zustand";
import { persist, devtools } from "zustand/middleware";
import { jwtDecode } from "jwt-decode";

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

type AuthState = {
  token: string | null;
  claims: JwtPayload | null;
  setToken: (token: string | null) => void;
  isExpired: () => boolean;
  logout: () => void;
};

export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set, get) => ({
        token: null,
        claims: null,

        setToken: (token) => {
          if (!token) {
            set({ token: null, claims: null }, false, "clearToken");
            return;
          }
          try {
            const claims = jwtDecode<JwtPayload>(token);
            set({ token, claims }, false, "setToken");
          } catch {
            set({ token: null, claims: null }, false, "invalidToken");
          }
        },

        isExpired: () => {
          const { token } = get();
          if (!token) return true;
          try {
            const { exp } = jwtDecode<JwtPayload>(token);
            if (!exp) return false;
            const now = Math.floor(Date.now() / 1000);
            return now >= exp;
          } catch {
            return true;
          }
        },

        logout: () => set({ token: null, claims: null }, false, "logout"),
      }),
      {
        name: "auth", // chave no localStorage
        version: 1,
        partialize: (s) => ({ token: s.token }),
      }
    ),
    { name: "Auth" } // <- nome que aparece no Redux DevTools
  )
);
