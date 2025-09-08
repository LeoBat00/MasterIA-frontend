'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
    Store,
    ChevronRight,
    Settings,
    Plus,
    LogOut,
    User, 
} from 'lucide-react';
import LoadingScreen from '@/components/UI/LoadingScreen';

type Loja = {
    id: string;
    nome: string;
};

export default function OrganizadorHome() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [lojas, setLojas] = useState<Loja[]>([
        { id: '1', nome: 'Dominaria' },
    ]);

    function handleCadastrarLoja() {
        const id = String(Date.now());
        setLojas((prev) => [{ id, nome: 'Nova loja' }, ...prev]);
    }

    function handleLogout() {
        router.push('/login');
    }
    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 1000); 
        return () => clearTimeout(timer);
    }, []);

    if (loading) return <LoadingScreen />;

    return (
        <>
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
                                Organizador
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
                                                aria-label={`Abrir ${l.nome}`}
                                            >
                                                <span className="flex items-center gap-2 text-sm text-zinc-200">
                                                    <Store className="h-4 w-4 text-purple-400" />
                                                    {l.nome}
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
                                        onClick={() => router.push('/login')}
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

                                <button
                                    onClick={handleCadastrarLoja}
                                    className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-gradient-to-r from-[#951FFB] to-[#685BFF] px-4 py-1.5 text-sm font-medium text-white shadow hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-purple-500/60"
                                >
                                    <span>Cadastrar loja</span>
                                    <Plus className="h-4 w-4" />
                                </button>
                            </div>

                            <div className="space-y-4">
                                {lojas.map((l) => (
                                    <article
                                        key={l.id}
                                        className="rounded-[8px] bg-gradient-to-b from-[#0E0E15] to-[#0B0B11] p-4 shadow-[0_0_0_1px_rgba(255,255,255,0.02)]"
                                        style={{
                                            borderLeft: '6px solid #616EFF',
                                            borderBottom: '1px solid #616EFF',
                                        }}
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="text-zinc-300">
                                                <div className="text-sm">Nome</div>
                                                <div className="text-lg font-medium">{l.nome}</div>
                                            </div>

                                            <button
                                                className="rounded-lg cursor-pointer border border-white/10 p-2 text-zinc-300 hover:border-purple-500/40 hover:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/60"
                                                aria-label={`Configurações da loja ${l.nome}`}
                                                title="Configurações"
                                            >
                                                <Settings className="h-5 w-5" />
                                            </button>
                                        </div>
                                    </article>
                                ))}

                                <button
                                    onClick={handleCadastrarLoja}
                                    className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-[8px] border border-purple-500/30 bg-purple-700/10 p-8 text-purple-200 hover:border-purple-500/60 hover:bg-purple-700/15 focus:outline-none focus:ring-2 focus:ring-purple-500/60"
                                    aria-label="Adicionar nova loja"
                                >
                                    <Plus className="h-5 w-5" />
                                    Adicionar nova loja
                                </button>
                            </div>


                        </section>
                    </main>
                </div>
            </div>
        </>
    );
}
