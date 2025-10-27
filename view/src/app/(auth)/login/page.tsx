"use client";

import Link from "next/link";
import { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { RxAvatar } from "react-icons/rx";
import Input from "@/components/UI/Input";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth";

type ErroLoginType = { loginInput: string; senha: string };

export default function LoginPage() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const router = useRouter();
  const { login, loading } = useAuthStore();

  const [showPassword, setShowPassword] = useState(false);
  const [loginInput, setLogin] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState<ErroLoginType>({
    loginInput: "",
    senha: "",
  });

  const handleLogin = async () => {
    const e: ErroLoginType = { loginInput: "", senha: "" };
    if (!loginInput.trim()) e.loginInput = "O campo loginInput é obrigatório.";
    else if (!/^\S+@\S+\.\S+$/.test(loginInput))
      e.loginInput = "O campo loginInput deve ser um e-mail válido.";
    if (!senha.trim()) e.senha = "O campo senha é obrigatório.";
    else if (senha.length < 6)
      e.senha = "A senha deve ter no mínimo 6 caracteres.";
    setErro(e);
    if (e.loginInput || e.senha) return;
    const ok = await login(loginInput, senha);
    if (ok) router.push("/organizadorHome");
  };

  return (
    <>
      <div className="md:max-w-[290px] lg:maxw-[380px] w-full z-30">
        <h2 className="text-2xl font-semibold text-center mb-2">BEM-VINDO!</h2>

        <div className="flex justify-center">
          <div className="rounded-full w-fit px-8 py-1 bg-[var(--background-color-3)]">
            <p className="text-xs text-center bg-[var(--text-color-1)] border-2 bg-clip-text text-transparent">
              Login
            </p>
          </div>
        </div>

        <form
          className="flex flex-col gap-4 mt-4  "
          onSubmit={async (e) => {
            e.preventDefault();
            if (!loading) await handleLogin();
          }}
        >
          <Input
            label="E-mail"
            type="email"
            autoComplete="email"
            placeholder="Digite seu e-mail"
            value={loginInput}
            onChange={setLogin}
            rightIcon={<RxAvatar />}
            maxLength={50}
            required
            error={erro.loginInput || undefined}
            disabled={loading}
          />

          <Input
            label="Senha"
            placeholder="Digite sua senha"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            value={senha}
            onChange={setSenha}
            rightIcon={showPassword ? <FiEye /> : <FiEyeOff />}
            onRightIconClick={() => setShowPassword((s) => !s)}
            maxLength={64}
            helperText="Use no mínimo 6 caracteres."
            required
            error={erro.senha || undefined}
            passwordToggle
            disabled={loading}
          />

          {/* {errorMsg && <p className="text-xs text-red-500">{errorMsg}</p>} */}

          <button
            type="submit"
            disabled={loading}
            className="bg-[var(--color-button-primary)] cursor-pointer rounded-[8px] text-black py-2  hover:opacity-90 mt-4 disabled:opacity-60"
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>
        <button
          onClick={() => {
            history.back();
          }}
          className="border-2 border-[var(--color-yellow-primary)] text-[var(--color-yellow-primary)] w-full block md:hidden cursor-pointer rounded-[8px] py-2  hover:opacity-90 mt-4 disabled:opacity-60"
        >
          Voltar
        </button>
        <Link href="/registro" className="mt-6 block text-center text-xs">
          Novo por aqui? <strong>Crie sua conta</strong>
        </Link>
      </div>
    </>
  );
}
