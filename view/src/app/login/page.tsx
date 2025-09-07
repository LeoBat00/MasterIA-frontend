'use client';

import Header from "@/components/Header";
import Link from "next/link";
import { useState } from "react";
import { ArrowBigLeftDash } from "lucide-react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { RxAvatar } from "react-icons/rx";
import Input from "@/components/UI/Input";
import { useRouter } from "next/navigation";
import { organizadorAuth } from "@/auth/hooks/organizadorAuth";

type ErroLoginType = { login: string; senha: string };

export default function LoginPage() {
    const { doLogin, loading, errorMsg } = organizadorAuth();
    const router = useRouter();

    const [showPassword, setShowPassword] = useState(false);
    const [login, setLogin] = useState("");
    const [senha, setSenha] = useState("");
    const [erro, setErro] = useState<ErroLoginType>({ login: "", senha: "" });

    const handleLogin = async () => {
        const e: ErroLoginType = { login: "", senha: "" };
        if (!login.trim()) e.login = "O campo login é obrigatório.";
        else if (!/^\S+@\S+\.\S+$/.test(login)) e.login = "O campo login deve ser um e-mail válido.";
        if (!senha.trim()) e.senha = "O campo senha é obrigatório.";
        else if (senha.length < 6) e.senha = "A senha deve ter no mínimo 6 caracteres.";
        setErro(e);
        if (e.login || e.senha) return;

        const ok = await doLogin({ email: login, password: senha });
        if (ok) router.push("/");
    };

    return (
        <>
            <Header />

            <div className="absolute top-25 left-6 z-10">
                <Link href="/" className="group">
                    <div className="p-2 rounded-full bg-[#9F9F9F] opacity-60 shadow-md shadow-gray-500 transition group-hover:shadow-lg group-hover:brightness-110">
                        <ArrowBigLeftDash className="text-white w-5 h-5" />
                    </div>
                </Link>
            </div>

            <div className="min-h-screen grid grid-cols-2 pt-8 md:pt-0">
                <div className="hidden md:flex flex-col justify-start bg-[var(--background-color-1)] items-center p-8 border-r-8 border-[var(--color-purple-1)]">
                    <div className="max-w-md w-full text-left">
                        <h1 className="text-3xl font-bold mb-4">Inicie sua jornada no MasterIA</h1>
                        <p className="text-gray-600 mb-6">O seu espaço para criar eventos, descobrir jogos e jogar junto.</p>
                        <div className="w-full h-64 border bg-gray-100 flex items-center justify-center">
                            <span className="text-gray-400">ainda sem, gerar com gpt</span>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col justify-start bg-[var(--background-color-2)] items-center px-6 py-12 sm:p-12">
                    <div className="w-full max-w-sm">
                        <h2 className="text-xl font-semibold text-center mb-2">BEM-VINDO!</h2>
                        <div className="flex justify-center">
                            <div className="rounded-full w-fit px-8 py-1 bg-[var(--background-color-3)]">
                                <p className="text-xs text-center bg-[var(--text-color-1)] bg-clip-text text-transparent">Login</p>
                            </div>
                        </div>

                        {/* use onSubmit para habilitar Enter e evitar cliques extras */}
                        <form
                            className="flex flex-col gap-4"
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

                            {/* erro vindo da API */}
                            {errorMsg && <p className="text-xs text-red-500">{errorMsg}</p>}

                            <button
                                type="submit"
                                disabled={loading}
                                className="bg-[var(--color-button-primary)] text-black py-2 rounded hover:opacity-90 mt-4 disabled:opacity-60"
                            >
                                {loading ? "Entrando..." : "Entrar"}
                            </button>
                        </form>

                        <Link href="/registro" className="mt-6 block text-center text-xs">
                            Novo por aqui? <strong>Crie sua conta</strong>
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
}
