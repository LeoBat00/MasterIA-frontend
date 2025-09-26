"use client";

import { useState, useEffect, useMemo } from "react";
import { login, register, LoginPayload } from "../services/auth.service";
import { Organizador } from "../../stores/organizador";
import { useAuthStore, JwtPayload } from "../../stores/auth";
import { jwtDecode } from "jwt-decode";

const STORAGE_KEY = "auth";

export function organizadorAuth() {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);

  const { token, claims, setToken, logout } = useAuthStore();

  // Hidrata token do storage e reconstrói claims
  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        const storedToken = parsed.state?.token ?? null;

        if (storedToken && !token) {
          setToken(storedToken);

        }
      }
    } catch (err) {
      console.error("Erro ao ler token do storage", err);
    } finally {
      setHydrated(true);
    }
  }, [token, setToken, logout]);

  const isAuth = useMemo(() => {
    if (!hydrated) return false;
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
      const newToken = await login(payload);
      setToken(newToken);

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
    hydrated,
  };
}
