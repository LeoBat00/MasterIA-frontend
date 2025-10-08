'use client';

import Link from "next/link";
import { useState } from "react";
import { FiEye, FiEyeOff, FiPhone } from "react-icons/fi";
import { RxAvatar } from "react-icons/rx";
import Input from "@/components/UI/Input";
import { isValidCPF, isValidCNPJ, onlyDigits } from "@/utils/validacoes";
import { useRouter } from "next/navigation";
import { useOrganizadorAuth } from "@/auth/hooks/organizadorAuth";
import { Organizador } from "@/stores/organizador";
type NovoOrganizadorForm = {
    email?: string;
    senha?: string;
    confirmarSenha?: string;
    cpfCnpj?: string;
    telefone?: string;
    nome?: string;
};

const MAX_SIZE_NOME = 45;
const MIN_SIZE_SENHA = 6;

export default function RegistroPage() {
    const [step, setStep] = useState<1 | 2>(1);
    const [showPassword, setShowPassword] = useState(false);
    const { doRegister, loading, errorMsg } = useOrganizadorAuth();
    const router = useRouter();

    const [camposForm, setCamposForm] = useState({} as NovoOrganizadorForm);
    const [erro, setErro] = useState({ email: "", senha: "", confirmarSenha: "", cpfCnpj: "", telefone: "", nome: "" } as NovoOrganizadorForm);

    const digits = (camposForm.cpfCnpj ?? "").replace(/\D/g, "");
    const maskCpfCnpj = digits.length > 11 ? "00.000.000/0000-00" : "000.000.000-00";

    // validações por passo
    const validarPasso1 = () => {
        const e: NovoOrganizadorForm = { email: "", senha: "", confirmarSenha: "", cpfCnpj: "", telefone: "", nome: "" };

        // e-mail
        if (!camposForm.email?.trim()) e.email = "O campo e-mail é obrigatório.";
        else {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(camposForm.email)) e.email = "O campo e-mail deve ser um e-mail válido.";
        }

        // senha
        if (!camposForm.senha?.trim()) e.senha = "O campo senha é obrigatório.";
        else if ((camposForm.senha?.length ?? 0) < MIN_SIZE_SENHA) e.senha = "O campo senha deve ter no mínimo 6 caracteres.";

        // confirmar senha
        if (!camposForm.confirmarSenha?.trim()) e.confirmarSenha = "O campo confirmar senha é obrigatório.";
        else if (camposForm.senha !== camposForm.confirmarSenha) e.confirmarSenha = "As senhas não coincidem.";

        setErro((old) => ({ ...old, ...e }));
        return !(e.email || e.senha || e.confirmarSenha);
    };

    const validarPasso2 = () => {
        const e: NovoOrganizadorForm = { email: "", senha: "", confirmarSenha: "", cpfCnpj: "", telefone: "", nome: "" };

        // nome
        if (!camposForm.nome?.trim()) e.nome = "O campo nome é obrigatório.";
        else if ((camposForm.nome?.length ?? 0) < 3) e.nome = "O campo nome deve ter no mínimo 3 caracteres.";
        else if ((camposForm.nome?.length ?? 0) > MAX_SIZE_NOME) e.nome = `O campo nome deve ter no máximo ${MAX_SIZE_NOME} caracteres.`;

        // cpf/cnpj
        if (!camposForm.cpfCnpj?.trim()) e.cpfCnpj = "O campo CPF/CNPJ é obrigatório.";
        else {
            const d = onlyDigits(camposForm.cpfCnpj);
            if (d.length !== 11 && d.length !== 14) e.cpfCnpj = "O campo CPF/CNPJ deve ter 11 (CPF) ou 14 (CNPJ) dígitos.";
            else if (d.length === 11 && !isValidCPF(d)) e.cpfCnpj = "CPF inválido.";
            else if (d.length === 14 && !isValidCNPJ(d)) e.cpfCnpj = "CNPJ inválido.";
        }

        // telefone (opcional)
        if (camposForm.telefone) {
            const cleaned = onlyDigits(camposForm.telefone);
            if (cleaned.length < 10 || cleaned.length > 11) e.telefone = "O campo telefone deve ter 10 ou 11 dígitos.";
        }

        setErro((old) => ({ ...old, ...e }));
        return !(e.nome || e.cpfCnpj || e.telefone);
    };

    const handleNext = () => {
        if (validarPasso1()) setStep(2);
    };

    const handleBack = () => setStep(1);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (step === 1) {
            handleNext();
            return;
        }

        if (!validarPasso2()) return;

        const payload: Organizador = {
            email: (camposForm.email ?? "").trim(),
            senha: camposForm.senha ?? "",
            razaoSocial: (camposForm.nome ?? "").trim(),
            cpfCnpj: onlyDigits(camposForm.cpfCnpj ?? ""),
            telefone: onlyDigits(camposForm.telefone ?? ""),
        };

        const ok = await doRegister(payload);
        if (ok) router.push("/login");
    };

    return (
        <>
            <h2 className="text-2xl font-semibold text-center mb-2">BEM-VINDO!</h2>
            <div className="flex flex-col items-center gap-2">
                <div className="rounded-full w-fit px-8 py-1 bg-[var(--background-color-3)]">
                    <p className="text-xs text-center bg-[var(--text-color-1)] bg-clip-text text-transparent">
                        {step === 1 ? "Passo 1 de 2" : "Passo 2 de 2"}
                    </p>
                </div>

            </div>

            <form className="flex flex-col gap-2 mt-4" onSubmit={handleSubmit}>
                {step === 1 ? (
                    <>
                        <Input
                            label="E-mail"
                            placeholder="Digite seu e-mail"
                            value={camposForm.email}
                            onChange={(value) => setCamposForm({ ...camposForm, email: value })}
                            rightIcon={<RxAvatar />}
                            type="email"
                            maxLength={50}
                            helperText="Use um e-mail válido."
                            required
                            error={erro.email}
                            disabled={loading}
                        />

                        <Input
                            label="Senha"
                            placeholder="Digite sua senha"
                            type={showPassword ? "text" : "password"}
                            value={camposForm.senha}
                            onChange={(value) => setCamposForm({ ...camposForm, senha: value })}
                            rightIcon={showPassword ? <FiEye /> : <FiEyeOff />}
                            onRightIconClick={() => setShowPassword(!showPassword)}
                            maxLength={20}
                            helperText="Use no mínimo 6 caracteres."
                            required
                            error={erro.senha}
                            passwordToggle
                            disabled={loading}
                        />

                        <Input
                            label="Confirmar Senha"
                            placeholder="Confirme sua senha"
                            type={showPassword ? "text" : "password"}
                            value={camposForm.confirmarSenha}
                            onChange={(value) => setCamposForm({ ...camposForm, confirmarSenha: value })}
                            rightIcon={showPassword ? <FiEye /> : <FiEyeOff />}
                            onRightIconClick={() => setShowPassword(!showPassword)}
                            maxLength={20}
                            helperText="Repita a senha."
                            required
                            error={erro.confirmarSenha}
                            passwordToggle
                            disabled={loading}
                        />

                        {errorMsg && <p className="text-xs text-red-500">{errorMsg}</p>}

                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-[var(--color-button-primary)] text-black py-2 cursor-pointer rounded hover:opacity-90 mt-2 disabled:opacity-60"
                        >
                            {loading ? "Validando..." : "Continuar"}
                        </button>

                        <Link href="/login" className="mt-4 block text-center text-xs">
                            Já tem uma conta? <strong>Entre</strong>
                        </Link>
                    </>
                ) : (
                    <>
                        <Input
                            label="Nome"
                            placeholder="Digite o seu nome"
                            value={camposForm.nome}
                            onChange={(value) => setCamposForm({ ...camposForm, nome: value })}
                            maxLength={100}
                            helperText="Seu nome ou nome da sua organização."
                            required
                            error={erro.nome}
                            disabled={loading}
                        />

                        <Input
                            label="CPF / CNPJ"
                            number
                            mask={maskCpfCnpj}
                            placeholder="CPF ou CNPJ"
                            value={camposForm.cpfCnpj}
                            onChange={(value) => setCamposForm({ ...camposForm, cpfCnpj: value })}
                            required
                            error={erro.cpfCnpj}
                            disabled={loading}
                        />

                        <Input
                            label="Telefone"
                            number
                            mask="(00) 0 0000-0000"
                            placeholder="Telefone para contato"
                            value={camposForm.telefone}
                            onChange={(value) => setCamposForm({ ...camposForm, telefone: value })}
                            rightIcon={<FiPhone />}
                            error={erro.telefone}
                            disabled={loading}
                        />

                        {errorMsg && <p className="text-xs text-red-500">{errorMsg}</p>}

                        <div className="flex gap-3 mt-2">
                            <button
                                type="button"
                                onClick={handleBack}
                                disabled={loading}
                                className="flex-1 border border-[var(--background-color-3)] rounded-[8px] cursor-pointer py-2 hover:bg-[var(--background-color-3)] disabled:opacity-60"
                            >
                                Voltar
                            </button>

                            <button
                                type="submit"
                                disabled={loading}
                                className="flex-1 bg-[var(--color-button-primary)] cursor-pointer rounded-[8px] text-black py-2  hover:opacity-90 disabled:opacity-60"
                            >
                                {loading ? "Cadastrando..." : "Cadastrar"}
                            </button>
                        </div>

                        <Link href="/login" className="mt-4 block text-center text-xs">
                            Já tem uma conta? <strong>Entre</strong>
                        </Link>
                    </>
                )}
            </form>
        </>
    );
}
