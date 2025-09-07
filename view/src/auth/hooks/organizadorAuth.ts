import { useState } from "react";
import { login, register, LoginPayload, Organizador } from "../services/auth.service";

export function organizadorAuth() {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const doLogin = async (payload: LoginPayload) => {
    setLoading(true); setErrorMsg(null);
    try {
      await login(payload);
      return true;
    } catch (e: any) {
      setErrorMsg(e.response?.data?.message ?? "Falha no login");
      return false;
    } finally { setLoading(false); }
  };

  const doRegister = async (payload: Organizador) => {
    setLoading(true); setErrorMsg(null);
    try {
      await register(payload);
      return true;
    } catch (e: any) {
      setErrorMsg(e.response?.data?.message ?? "Falha no cadastro");
      return false;
    } finally { setLoading(false); }
  };

  return { doLogin, doRegister, loading, errorMsg };
}
