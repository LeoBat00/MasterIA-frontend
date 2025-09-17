'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { PrivatePage } from '@/components/PrivatePage';
import {
    Store,
    ChevronRight,
    Plus,
    LogOut,
    User,
    Trash,
    Pen
} from 'lucide-react';
import LoadingScreen from '@/components/UI/LoadingScreen';
import { useOrganizadorStore, Loja } from '../../stores/organizador';
import FormularioNovaLoja from './formularioNovaLoja';
import { useLojaStore } from '@/stores/loja';
import { useAuthStore } from '@/stores/auth';

export default function OrganizadorHome() {
    const router = useRouter();
    const { logout } = useAuthStore.getState();
    const [loading, setLoading] = useState(false);
    const [lojas, setLojas] = useState<Loja[]>([]);
    const { exibirFormularioLoja, setExibirFormularioLoja, atualizarLoja } = useLojaStore();
    const { organizador, fetchOrganizador } = useOrganizadorStore();

    function handleCadastrarLoja() {
        setExibirFormularioLoja(!exibirFormularioLoja);
    }

    function handleLogout() {
        logout();
        router.push('/login');
    }
    useEffect(() => {
        
        setLojas(organizador?.lojas || []);

    }, [organizador, fetchOrganizador, router]);

    const obterEnderecoCompleto = (loja: Loja) => {
        return `${loja.logradouro}, ${loja.numero} - ${loja.bairro}, ${loja.cidade} - ${loja.uf}, ${loja.cep}`;
    }

    const handleEditarLoja = (loja: Loja) => {
        atualizarLoja(loja);
        setExibirFormularioLoja(true);
    }

    const handleAcessarLoja = (loja: Loja) => {
        router.push(`/loja/${loja.id}`);
    }

    if (loading) return <LoadingScreen />;

    return (
        <PrivatePage>
            <div className="relative min-h-screen w-full bg-[#0D0D12] text-white">
                <div
                    className="absolute inset-0 bg-center bg-cover opacity-10"
                    style={{ backgroundImage: "url('/bgCadastroLoja.png')" }}
                />
                <div className="relative mx-auto flex gap-6 px-4 py-6 lg:px-8">
                    <aside
                        className="relative sticky top-0 h-[calc(100vh-48px)] w-64 shrink-0 rounded-[8px] border border-white/5 bg-[#0B0B10]/90 p-4"
                        aria-label="Menu do organizador"
                    >
                        <div className="h-full overflow-y-auto pr-1 pb-32">
                            <div className="mb-4 px-2 text-sm font-semibold tracking-wide text-purple-300">
                                Organizador - {organizador?.razaoSocial || organizador?.email}
                            </div>

                            <nav className="space-y-2">
                                <div className="px-2 text-xs uppercase tracking-wide text-zinc-400">
                                    Lojas Cadastradas
                                </div>

                                <ul className="mt-2 space-y-1">
                                    {lojas.map((l) => (
                                        <li key={l.id}>
                                            <button
                                                className="group flex w-full items-center justify-between rounded-[8px] border border-white/5 bg-gradient-to-b from-[#0C0C12] to-[#0A0A10] px-3 py-2 text-left hover:border-purple-500/40 focus:outline-none focus:ring-2 focus:ring-purple-500/60"
                                                aria-label={`Abrir ${l.id}`}
                                            >
                                                <span className="flex items-center gap-2 text-sm text-zinc-200">
                                                    <Store className="h-4 w-4 text-purple-400" />
                                                    {l.id}
                                                </span>
                                                <ChevronRight className="h-4 w-4 text-zinc-500 group-hover:text-zinc-300" />
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </nav>
                        </div>

                        <div className="pointer-events-auto absolute inset-x-4 bottom-4">
                            <div className="border-t border-white/5 pt-4">
                                <div className="px-2 text-xs uppercase tracking-wide text-zinc-400">
                                    Configurações
                                </div>

                                <div className="mt-2">
                                    <button
                                        className="flex w-full items-center gap-2 rounded-[8px] border border-white/10 bg-white/5 px-3 py-2 text-sm text-zinc-200 hover:border-purple-500/40 hover:bg-white/10 hover:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/60"
                                        aria-label="Abrir perfil"
                                    >
                                        <User className="h-4 w-4 text-zinc-300" />
                                        <span>Perfil</span>
                                    </button>
                                </div>

                                <div className="mt-3">
                                    <button
                                        onClick={handleLogout}
                                        className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-[8px] border border-yellow-400/30 bg-yellow-500/10 px-3 py-2 text-sm text-yellow-300 hover:border-yellow-400/60 hover:bg-yellow-500/15 focus:outline-none focus:ring-2 focus:ring-yellow-500/60"
                                        aria-label="Sair da conta"
                                    >
                                        <span>Sair da conta</span>
                                        <LogOut className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </aside>
                    <main className="flex-1">
                        <div className="mb-6">
                            <h1 className="text-3xl font-semibold leading-tight text-zinc-100">
                                Bem vindo ao{' '}
                                <span className="bg-gradient-to-r from-[#685BFF] via-[#951FFB] to-[#7C3AED] bg-clip-text text-transparent">
                                    MasterIA
                                </span>{' '}
                                !
                            </h1>
                            <p className="mt-1 text-sm text-zinc-400">Gerencie suas lojas</p>
                        </div>
                        <section aria-labelledby="lojas-cadastradas">
                            <div className="mb-3 flex items-center gap-3">
                                <h2
                                    id="lojas-cadastradas"
                                    className="text-lg font-semibold text-zinc-200"
                                >
                                    Lojas cadastradas
                                </h2>

                                {!exibirFormularioLoja && <button
                                    onClick={handleCadastrarLoja}
                                    className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-gradient-to-r from-[#951FFB] to-[#685BFF] px-4 py-1.5 text-sm font-medium text-white shadow hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-purple-500/60"
                                >
                                    <span>Cadastrar loja</span>
                                    <Plus className="h-4 w-4" />
                                </button>}
                            </div>

                            <div className="space-y-4">
                                {exibirFormularioLoja ?
                                    <div>
                                        <FormularioNovaLoja />
                                    </div>
                                    :
                                    lojas.map((l) => (
                                        <article
                                            onClick={() => handleAcessarLoja(l)}
                                            key={l.id}
                                            className="z-10 rounded-[8px] bg-gradient-to-b from-[#0E0E15] to-[#0B0B11] p-4 shadow-[0_0_0_1px_rgba(255,255,255,0.02)] hover:cursor-pointer border-l-[6px] border-b border-[var(--color-purple-2)] hover:border-[var(--color-purple-4)]"
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="">
                                                    <div className="text-lg font-medium mb-1">{l.id}</div>
                                                    <div className="text-lg font-medium text-zinc-500">
                                                        <span className='mr-1'>Endereço:</span>
                                                        <span>{obterEnderecoCompleto(l)}</span>
                                                    </div>

                                                </div>

                                                <div className='flex gap-2'>

                                                    <button
                                                        className="rounded-lg cursor-pointer border border-white/10 p-2 text-zinc-300 hover:border-purple-500/40 hover:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/60"
                                                        aria-label={`Editar a loja ${l.id}`}
                                                        title="Editar loja"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleEditarLoja(l);
                                                        }}                                                    >
                                                        <Pen className="h-5 w-5" />
                                                    </button>

                                                    <button
                                                        className="rounded-lg cursor-pointer border border-white/10 p-2 text-zinc-300 hover:border-purple-500/40 hover:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/60"
                                                        aria-label={`Excluir a loja ${l.id}`}
                                                        title="Excluir loja"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            console.log("clicou no botão excluir");
                                                        }}
                                                    >
                                                        <Trash className="h-5 w-5" />
                                                    </button>
                                                </div>
                                            </div>

                                            <div className='flex justify-end mt-4'>

                                                <span className='text-sm text-purple-400 flex items-center gap-1 cursor-pointer'>
                                                    Acessar loja
                                                </span>
                                                <ChevronRight className='h-5 w-5 text-purple-400 ' />

                                            </div>
                                        </article>
                                    ))}

                                {!exibirFormularioLoja && <button
                                    onClick={handleCadastrarLoja}
                                    className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-[8px] border border-purple-500/30 bg-purple-700/10 p-8 text-purple-200 hover:border-purple-500/60 hover:bg-purple-700/15 focus:outline-none focus:ring-2 focus:ring-purple-500/60"
                                    aria-label="Adicionar nova loja"
                                >
                                    <Plus className="h-5 w-5" />
                                    Adicionar nova loja"
                                </button>}
                            </div>


                        </section>
                    </main>
                </div>
            </div>
        </PrivatePage>
    );
}
