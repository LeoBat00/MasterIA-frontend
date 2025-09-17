import { useState, useEffect, useMemo } from "react";
import { login, register, LoginPayload } from "../services/auth.service";
import { Organizador } from "../../stores/organizador";
import { useAuthStore, JwtPayload } from "../../stores/auth";
import { jwtDecode } from "jwt-decode";
import { useOrganizadorStore } from "../../stores/organizador";

const STORAGE_KEY = "auth";

// Função auxiliar para pegar token do localStorage
function getStoredToken(): string | null {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    return parsed.state?.token ?? null;
  } catch {
    return null;
  }
}

export function organizadorAuth() {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);

  const { token, claims, setToken, logout } = useAuthStore();

  // inicializa a store com o valor do storage, se precisar
  useEffect(() => {
    if (!token) {
      const stored = getStoredToken();
      if (stored) {
        setToken(stored);

        try {
          const claims = jwtDecode<JwtPayload>(stored);
          const organizadorId = claims?.nameid ? Number(claims.nameid) : undefined;
          if (organizadorId) {
            useOrganizadorStore.getState().fetchOrganizador(organizadorId);
          }
        } catch {
          console.error("Token inválido no storage");
        }
      }
    }
    setHydrated(true);
  }, [token, setToken]);

  const isAuth = useMemo(() => {
    if (!hydrated) return false; // evita mismatch de SSR

    if (!token) return false;

    try {
      const { exp } = jwtDecode<JwtPayload>(token);
      if (!exp) return true;
      const now = Math.floor(Date.now() / 1000);
      return now < exp;
    } catch {
      return false;
    }
  }, [token, hydrated]);

  const doLogin = async (payload: LoginPayload) => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const token = await login(payload);
      setToken(token);
      const claims = useAuthStore.getState().claims;
      const organizadorId = claims?.nameid ? Number(claims.nameid) : undefined;
      if (organizadorId) {
        await useOrganizadorStore.getState().fetchOrganizador(organizadorId);
      }
      return true;
    } catch (e: any) {
      setErrorMsg(e.response?.data?.message ?? "Falha no login");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const doRegister = async (payload: Organizador) => {
    setLoading(true);
    setErrorMsg(null);
    try {
      await register(payload);
      return true;
    } catch (e: any) {
      setErrorMsg(e.response?.data?.message ?? "Falha no cadastro");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    doLogin,
    doRegister,
    loading,
    errorMsg,
    isAuth,
    token,
    claims,
    logout,
    hydrated
  };
}
