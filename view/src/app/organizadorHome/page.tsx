'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { PrivatePage } from '@/components/PrivatePage';
import { FaTrash, FaPen } from 'react-icons/fa';
import {
    ChevronRight,
    Plus
} from 'lucide-react';
import { useOrganizadorStore, Loja } from '../../stores/organizador';
import FormularioNovaLoja from './formularioNovaLoja';
import { useLojaStore } from '@/stores/loja';
import { obterEnderecoCompleto } from '../util';
import { useAuthStore } from '@/stores/auth';

export default function OrganizadorHome() {
    const router = useRouter();
    const [lojas, setLojas] = useState<Loja[]>([]);
    const { claims, logout } = useAuthStore();

    const { exibirFormularioLoja, setExibirFormularioLoja, atualizarLoja } = useLojaStore();
    const { organizador, fetchOrganizador } = useOrganizadorStore();

    function handleCadastrarLoja() {
        setExibirFormularioLoja(!exibirFormularioLoja);
    }

    const buscarOrganizador = async (organizadorId: number) => {
        console.log('Buscando organizador com ID:', organizadorId);
        await fetchOrganizador(organizadorId).catch(() => {
            logout();
            window.location.href = "/";
        });
    }

    useEffect(() => {
        const run = async () => {
            const organizadorId = claims?.nameid ? Number(claims.nameid) : undefined;
            if (organizadorId && !organizador ) {
                try {
                    await buscarOrganizador(organizadorId);
                } catch {
                    logout();
                    window.location.href = "/";
                }
            }
        };

        run();
    }, [claims]);

    useEffect(() => {
        setLojas(organizador?.lojas || []);

    }, [organizador]);


    const handleEditarLoja = (loja: Loja) => {
        atualizarLoja(loja);
        setExibirFormularioLoja(true);
    }

    const handleAcessarLoja = (loja: Loja) => {
        router.push(`/loja/${loja.id}`);
    }

    return (
        <PrivatePage>
            <div className="relative min-h-screen w-full text-white">
                <div
                    className="absolute inset-0 bg-center bg-cover opacity-10"
                    style={{ backgroundImage: "url('/bgCadastroLoja.png')" }}
                />
                <div className="relative mx-auto flex gap-6 px-4 py-6 lg:px-8">
                    <main className="flex-1">
                        <div className="mb-6">
                            <h1>
                                <span className="texto-light text-zinc-200">Bem vindo ao</span>{" "}
                                <span className="texto-medium bg-gradient-to-r from-[#685BFF] via-[#951FFB] to-[#7C3AED] bg-clip-text text-transparent">
                                    MasterIA!
                                </span>{" "}
                            </h1>
                            <p className="mt-1 text-lg text-zinc-400">Gerencie suas lojas</p>
                            <div className="mt-4 border-b border-zinc-600" />
                        </div>
                        <section aria-labelledby="lojas-cadastradas">
                            <div className="mb-3 flex items-center gap-3 mb-6">
                                <h2
                                    id="lojas-cadastradas"
                                    className="text-lg font-semibold text-zinc-200"
                                >
                                    Lojas cadastradas
                                </h2>

                                {!exibirFormularioLoja && <button
                                    onClick={handleCadastrarLoja}
                                    className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-gradient-to-r from-[#951FFB] to-[#685BFF] px-10 py-1.5 text-sm font-medium text-white shadow hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-purple-500/60"
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
                                            className="rounded-[8px] bg-gradient-to-b from-[#0E0E15] to-[#0B0B11] p-4 shadow-[0_0_0_1px_rgba(255,255,255,0.02)] hover:cursor-pointer border-l-[6px] border-b border-[var(--color-purple-2)] hover:border-[var(--color-purple-1)]"
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
                                                        <FaPen className="h-5 w-5" />
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
                                                        <FaTrash className="h-5 w-5" />
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
