'use client';

import Header from "@/components/Header";
import Link from "next/link";
import { useState } from "react";
import { ArrowBigLeftDash, } from "lucide-react";
import { FiEye, FiEyeOff, FiPhone } from "react-icons/fi";
import { RxAvatar } from "react-icons/rx";
import Input from "@/components/UI/Input";
import { isValidCPF, isValidCNPJ, onlyDigits } from "../../utils/validacoes";
import { useRouter } from "next/navigation";
import { organizadorAuth } from "@/auth/hooks/organizadorAuth";
import { Organizador } from "@/auth/services/auth.service";

export default function RegistroPage() {

    type novoOrganizadorForm = {
        email?: string;
        senha?: string;
        confirmarSenha?: string;
        cpfCnpj?: string;
        telefone?: string;
        nome?: string;
    };

    const MAX_SIZE_NOME = 45;
    const MIN_SIZE_SENHA = 6;

    const [showPassword, setShowPassword] = useState(false);
    const { doRegister, loading, errorMsg } = organizadorAuth();
    const router = useRouter();

    const [camposForm, setCamposForm] = useState({} as novoOrganizadorForm);
    const [erro, setErro] = useState({ login: "", senha: "", confirmarSenha: "", cpfCnpj: "", telefone: "", nome: "" } as novoOrganizadorForm);

    const digits = (camposForm.cpfCnpj ?? "").replace(/\D/g, "");
    const maskCpfCnpj = digits.length > 11 ? "00.000.000/0000-00" : "000.000.000-000";

    const validarForm = () => {
        const erros: novoOrganizadorForm = { email: "", senha: "", confirmarSenha: "", cpfCnpj: "", telefone: "", nome: "" };
        // validação e-mail
        const emailVazio = !camposForm.email || (camposForm.email && camposForm.email.trim() === "");

        if (emailVazio) {
            erros.email = "O campo e-mail é obrigatório.";
        }

        if (camposForm.email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            const emailInvalido = !emailRegex.test(camposForm.email);
            emailInvalido && (erros.email = "O campo e-mail deve ser um e-mail válido.");
        }
        // validação senha
        const senhaVazia = !camposForm.senha || (camposForm.senha && camposForm.senha.trim() === "");
        if (senhaVazia) {
            erros.senha = "O campo senha é obrigatório.";
        }

        if (camposForm.senha && camposForm.senha.length < MIN_SIZE_SENHA) {
            erros.senha = "O campo senha deve ter no mínimo 6 caracteres.";
        }

        const confirmarSenhaVazia = !camposForm.confirmarSenha || (camposForm.confirmarSenha && camposForm.confirmarSenha.trim() === "");
        if (confirmarSenhaVazia) {
            erros.confirmarSenha = "O campo confirmar senha é obrigatório.";
        }

        if (camposForm.senha && camposForm.confirmarSenha && camposForm.senha !== camposForm.confirmarSenha) {
            erros.confirmarSenha = "As senhas não coincidem.";
        }

        //validação nome
        const nomeVazio = !camposForm.nome || (camposForm.nome && camposForm.nome.trim() === "");
        if (nomeVazio) {
            erros.nome = "O campo nome é obrigatório.";
        }
        if (camposForm.nome && camposForm.nome.length < 3) {
            erros.nome = "O campo nome deve ter no mínimo 3 caracteres.";
        }
        if (camposForm.nome && camposForm.nome.length > MAX_SIZE_NOME) {
            erros.nome = `O campo nome deve ter no máximo ${MAX_SIZE_NOME} caracteres. `;
        }

        // validação cpfCnpj
        const cpfCnpjVazio = !camposForm.cpfCnpj || (camposForm.cpfCnpj && camposForm.cpfCnpj.trim() === "");
        if (cpfCnpjVazio) {
            erros.cpfCnpj = "O campo CPF/CNPJ é obrigatório.";
        }
        if (camposForm.cpfCnpj) {
            const digits = onlyDigits(camposForm.cpfCnpj);

            if (digits.length !== 11 && digits.length !== 14) {
                erros.cpfCnpj = "O campo CPF/CNPJ deve ter 11 (CPF) ou 14 (CNPJ) dígitos.";
            } else if (digits.length === 11) {
                if (!isValidCPF(digits)) {
                    erros.cpfCnpj = "CPF inválido.";
                }
            } else {
                if (!isValidCNPJ(digits)) {
                    erros.cpfCnpj = "CNPJ inválido.";
                }
            }
        }

        // validação telefone
        if (camposForm.telefone) {
            const cleaned = onlyDigits(camposForm.telefone);
            if (cleaned.length < 10 || cleaned.length > 11) {
                erros.telefone = "O campo telefone deve ter 10 ou 11 dígitos.";
            }
        }

        setErro(erros);

        if (erros.email || erros.senha || erros.confirmarSenha || erros.cpfCnpj || erros.telefone || erros.nome) {
            return false;
        }

        return true;

    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault(); // impede submit padrão/refresh

        const formValido = validarForm();
        if (!formValido) return;

        const payload: Organizador = {
            email: (camposForm.email ?? "").trim(),
            senha: camposForm.senha ?? "",
            nome: (camposForm.nome ?? "").trim(),
            cpfCnpj: onlyDigits(camposForm.cpfCnpj ?? ""),
            telefone: onlyDigits(camposForm.telefone ?? ""),
        };

        const ok = await doRegister(payload);
        if (ok) router.push("/login");
    };


    const handleChangeEmail = (value: string) => {
        setCamposForm({ ...camposForm, email: value });
    }
    const handleChangeSenha = (value: string) => {
        setCamposForm({ ...camposForm, senha: value });
    }
    const handleChangeConfirmarSenha = (value: string) => {
        setCamposForm({ ...camposForm, confirmarSenha: value });
    }
    const handleChangeNome = (value: string) => {
        setCamposForm({ ...camposForm, nome: value });
    }

    const handleChangeCpfCnpj = (value: string) => {
        setCamposForm({ ...camposForm, cpfCnpj: value });
    }
    const handleChangeTelefone = (value: string) => {
        setCamposForm({ ...camposForm, telefone: value });
    }

    return (
        <>
            <Header />

            <div className="absolute top-25 left-6 z-10">
                <Link href="/" className="group">
                    <div className="p-2 rounded-full bg-[#9F9F9F] opacity-60 shadow-md shadow-gray-500 transition duration-200 group-hover:shadow-lg group-hover:brightness-110">
                        <ArrowBigLeftDash className="text-white w-5 h-5" />
                    </div>
                </Link>
            </div>

            <div className="min-h-screen grid grid-cols-2 md:grid-cols-2 pt-8 md:pt-0">
                <div className="hidden md:flex flex-col justify-start bg-[var(--background-color-1)] items-center p-8 border-r-8   border-[var(--color-purple-1)]">
                    <div className="max-w-md w-full text-left">
                        <h1 className="text-3xl font-bold mb-4">Inicie sua jornada no MasterIA</h1>
                        <p className="text-gray-600 mb-6">
                            O seu espaço para criar eventos, descobrir jogos e jogar junto.
                        </p>
                        <div className="w-full h-64 border bg-gray-100 flex items-center justify-center">
                            <span className="text-gray-400">ainda sem, gerar com gpt</span>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col justify-start bg-[var(--background-color-2)] items-center px-6 py-12 sm:p-12">
                    <div className="w-full max-w-sm " >
                        <h2 className="text-xl font-semibold  text-center mb-2">BEM-VINDO!</h2>
                        <div className="flex justify-center items-center">
                            <div className="border border-none rounded-full w-fit px-8 py-1 bg-[var(--background-color-3)]">
                                <p className="text-xs text-center bg-[var(--text-color-1)] bg-clip-text text-transparent">Registro</p>
                            </div>

                        </div>


                        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                            <Input
                                label="E-mail"
                                placeholder="Digite seu usuário ou e-mail"
                                value={camposForm.email}
                                onChange={(value) => handleChangeEmail(value)}
                                rightIcon={<RxAvatar />}
                                maxLength={50}
                                helperText="Use um e-mail válido."
                                required
                                error={erro.email}
                            />

                            <Input
                                label="Senha"
                                placeholder="Digite sua senha"
                                type={showPassword ? "text" : "password"}
                                value={camposForm.senha}
                                onChange={(value) => handleChangeSenha(value)}
                                rightIcon={showPassword ? <FiEye /> : <FiEyeOff />}
                                onRightIconClick={() => setShowPassword(!showPassword)}
                                maxLength={20}
                                helperText="Use no mínimo 6 caracteres."
                                required
                                error={erro.senha}
                                passwordToggle
                            />

                            <Input
                                label="Confirmar Senha"
                                placeholder="confirme sua senha"
                                type={showPassword ? "text" : "password"}
                                value={camposForm.confirmarSenha}
                                onChange={(value) => handleChangeConfirmarSenha(value)}
                                rightIcon={showPassword ? <FiEye /> : <FiEyeOff />}
                                onRightIconClick={() => setShowPassword(!showPassword)}
                                maxLength={20}
                                helperText="Use no mínimo 6 caracteres."
                                required
                                error={erro.confirmarSenha}
                                passwordToggle
                            />

                            <Input
                                label="Nome"
                                placeholder="Digite o seu nome"
                                value={camposForm.nome}
                                onChange={(value) => handleChangeNome(value)}
                                maxLength={100}
                                helperText="Seu nome ou nome da sua organização."
                                required
                                error={erro.nome}
                                passwordToggle
                            />

                            <Input
                                label="CPF / CNPJ"
                                number
                                mask={maskCpfCnpj} // alterado para string simples
                                placeholder="CPF ou CNPJ"
                                value={camposForm.cpfCnpj}
                                onChange={(value) => handleChangeCpfCnpj(value)}
                                required
                                error={erro.cpfCnpj}
                            />

                            <Input
                                label="Telefone"
                                number
                                mask="(00) 0 0000-0000"
                                placeholder="Telefone para contato"
                                value={camposForm.telefone}
                                onChange={(value) => handleChangeTelefone(value)}
                                rightIcon={<FiPhone />}
                                error={erro.telefone}
                            />

                            {errorMsg && <p className="text-xs text-red-500">{errorMsg}</p>}

                            <button
                                type="submit"
                                disabled={loading}
                                className="bg-[var(--color-button-primary)] text-black py-2 rounded hover:opacity-90 mt-4 disabled:opacity-60"
                            >
                                {loading ? "Cadastrando..." : "Cadastrar"}
                            </button>
                        </form>

                        <Link href="/login" className="mt-6 block">
                            <p className="text-xs text-center mt-4">
                                Já tem uma conta? <strong>Entre</strong>
                            </p>
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
}
