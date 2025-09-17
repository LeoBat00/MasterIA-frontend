'use client';

import Link from "next/link";
import { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { RxAvatar } from "react-icons/rx";
import Input from "@/components/UI/Input";
import { useRouter } from "next/navigation";
import { organizadorAuth } from "@/auth/hooks/organizadorAuth";

type ErroLoginType = { login: string; senha: string };

export default function LoginPage() {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { doLogin, loading, errorMsg } = organizadorAuth();
    const router = useRouter();

    const [showPassword, setShowPassword] = useState(false);
    const [login, setLogin] = useState("cairo@email.com");
    const [senha, setSenha] = useState("123456");
    const [erro, setErro] = useState<ErroLoginType>({ login: "", senha: "" });

    const handleLogin = async () => {
        const e: ErroLoginType = { login: "", senha: "" };
        if (!login.trim()) e.login = "O campo login é obrigatório.";
        else if (!/^\S+@\S+\.\S+$/.test(login)) e.login = "O campo login deve ser um e-mail válido.";
        if (!senha.trim()) e.senha = "O campo senha é obrigatório.";
        else if (senha.length < 6) e.senha = "A senha deve ter no mínimo 6 caracteres.";
        setErro(e);
        if (e.login || e.senha) return;
        const ok = await doLogin({ email: login, senha: senha });
        if (ok) router.push("/organizadorHome");

    };

    return (
        <>
            <h2 className="text-2xl font-semibold text-center mb-2">BEM-VINDO!</h2>
            <div className="flex justify-center">
                <div className="rounded-full w-fit px-8 py-1 bg-[var(--background-color-3)]">
                    <p className="text-xs text-center bg-[var(--text-color-1)] bg-clip-text text-transparent">Login</p>
                </div>
            </div>

            <form
                className="flex flex-col gap-2 mt-4"
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
                    value={login}
                    onChange={setLogin}
                    rightIcon={<RxAvatar />}
                    maxLength={50}
                    helperText="Use um e-mail válido."
                    required
                    error={erro.login || undefined}
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

                {errorMsg && <p className="text-xs text-red-500">{errorMsg}</p>}

                <button
                    type="submit"
                    disabled={loading}
                    className="bg-[var(--color-button-primary)] cursor-pointer rounded-[8px] text-black py-2  hover:opacity-90 mt-4 disabled:opacity-60"
                >
                    {loading ? "Entrando..." : "Entrar"}
                </button>
            </form>

            <Link href="/registro" className="mt-6 block text-center text-xs">
                Novo por aqui? <strong>Crie sua conta</strong>
            </Link>
        </>
    );
}
