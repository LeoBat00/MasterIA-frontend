"use client";
import { LogOut, User } from "lucide-react";
import { FaStore, FaChevronRight, FaUser, FaDice } from "react-icons/fa"
import { useAuthStore } from "@/stores/auth";
import { useOrganizadorStore } from "@/stores/organizador";
import Button from "../UI/Button";
import { useRouter } from "next/navigation";

const MenuLateral = () => {

    const { organizador } = useOrganizadorStore();
    const router = useRouter();


    const { logout } = useAuthStore();

    const handleClickHome = () => {
        router.push("/organizadorHome");
    }

    const handleClickMeuCadastro = () => {
        console.log("Meu Cadastro");
    }

    const handleClickJogosCadastrados = () => {
        console.log("Jogos Cadastrados");
    }

    const handleClickLogout = () => {
        logout();
        router.push("/");
    }

    return (<div>
        <aside
            className="relative sticky top-0 h-[calc(100vh-48px)] w-64 shrink-0 rounded-[8px] border border-[#53339A] bg-[#040405] p-4"
            aria-label="Menu do organizador"
        >
            <div className="h-full overflow-y-auto pr-1 pb-32">
                <div className="mb-4 px-2 texto-destaque text-center text-xl">
                    {organizador?.razaoSocial || organizador?.email || "Organizador"}
                    <div className="mt-2 border-b border-zinc-600" />
                </div>

                <nav className="space-y-2">
                    <Button
                        variant="outline"
                        size="sm"
                        fullWidth
                        leftIcon={<FaStore />}
                        rightIcon={<FaChevronRight />}
                        onClick={handleClickHome}
                        className="justify-start">
                        Home
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        fullWidth
                        leftIcon={<FaUser />}
                        rightIcon={<FaChevronRight />}
                        onClick={handleClickMeuCadastro}
                        className="justify-start">
                        Meu Cadastro
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        fullWidth
                        leftIcon={<FaDice />}
                        rightIcon={<FaChevronRight />}
                        onClick={handleClickJogosCadastrados}
                        className="justify-start">
                        Jogos Cadastrados
                    </Button>
                </nav>
            </div>

            <div className="pointer-events-auto absolute inset-x-4 bottom-4">
                <div className="border-t border-white/5 pt-4">

                    <div className="mt-3">
                        <button
                            className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-[8px] border border-yellow-400/30 bg-yellow-500/10 px-3 py-2 text-sm text-yellow-300 hover:border-yellow-400/60 hover:bg-yellow-500/15 focus:outline-none focus:ring-2 focus:ring-yellow-500/60"
                            aria-label="Sair da conta"
                            onClick={() => handleClickLogout()}
                        >
                            <span>Sair da conta</span>
                            <LogOut className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            </div>
        </aside>
    </div>);
};

export default MenuLateral;