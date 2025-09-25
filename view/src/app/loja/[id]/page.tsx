'use client';

import { usePaginaLojaStore } from "@/stores/paginaLoja";
import { obterEnderecoCompleto } from "../../util";
import { FaGear } from "react-icons/fa6";
import { FaStore, FaChessBoard, FaCalendar } from "react-icons/fa"
import { CardAtalho } from "./CardAtalho";
import { CardEvento } from "./CardEvento";
import { useEffect } from "react";
import { useParams } from "next/navigation";
import { calcularStatus } from "../../util";
import Button from "@/components/UI/Button";
import { useRouter } from "next/navigation";


export default function PageLoja() {

    const { lojaSelecionada, fetchLoja } = usePaginaLojaStore();
    const params = useParams(); // pega params da rota, ex: /loja/[id]
    const lojaId = Number(params?.id);
    const router = useRouter();

    const listaEventosAtivos =
        (lojaSelecionada?.eventos ?? []).filter((evento) => {
            const statusAtual = calcularStatus(evento);
            return statusAtual === "Ativo" || statusAtual === "EmAndamento";
        }) || [];

    useEffect(() => {
        if (lojaId && fetchLoja) {
            fetchLoja(lojaId).then((res) => {
                if (!res.success) {
                    console.error("Erro ao buscar loja:", res.error);
                }
            });
        }
    }, [lojaId, fetchLoja]);

    const handleVoltar = () => {
        router.push('/organizadorHome');
    }

    const handleClickGerenciarEventos = () => {
        router.push(`/eventos`);
    }

    return (
        <div className="page">

            {lojaSelecionada ?
                <div className="min-h-screen flex flex-col pb-8">
                    <div className="flex-1">
                        <div id="tituloPaginaLoja" className="mb-6">
                            <span className="texto-light">{lojaSelecionada.logradouro}</span>
                            <p className="mt-1 text-lg text-zinc-400">Gerencie suas lojas</p>
                            <div className="mt-4 border-b border-zinc-600" />
                        </div>

                        <div className="flex items-center p-2 rounded-[8px] justify-between border border-[var(--color-purple-1)] px-4 mb-6">
                            <div className="text-lg font-medium text-zinc-500">
                                <div className="grid grid-cols-[120px_1fr] gap-y-1 p-3">
                                    <span className="font-medium">Endereço</span>
                                    <span>{obterEnderecoCompleto(lojaSelecionada)}</span>

                                    <span className="font-medium">Status</span>
                                    <span>{lojaSelecionada.status ? "Ativo" : "Inativo"}</span>
                                </div>

                            </div>

                            <button
                                className="rounded-lg cursor-pointer border border-white/10 p-2 text-zinc-300 hover:border-purple-500/40 hover:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/60"
                                aria-label={`Editar a loja ${lojaSelecionada.id}`}
                                title="Editar loja"
                                onClick={() => console.log("configuração da loja")}
                            >
                                <FaGear className="h-5 w-5" />
                            </button>
                        </div>

                        <div className="w-full flex gap-6 justify-between bg-[var(--background-color-6)] rounded-[8px] p-6 mb-6">

                            <CardAtalho
                                onClick={handleClickGerenciarEventos}
                                icon={<FaCalendar />}
                                label="Gerenciar Eventos"
                            />
                            <CardAtalho
                                onClick={() => console.log("Cadastro de jogos")}
                                icon={<FaChessBoard />}
                                label="Cadastro de Jogos"
                            />
                            <CardAtalho
                                onClick={() => console.log("Dados da loja")}
                                icon={<FaStore />}
                                label="Dados da Loja"
                            />

                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {listaEventosAtivos.length > 0 ? listaEventosAtivos.map(evento => (
                                <CardEvento
                                    key={evento.id}
                                    evento={evento}
                                    onClick={(e) => console.log("Evento clicado:", e)}
                                />
                            )) : <span className="text-zinc-400">Nenhum evento ativo</span>
                            }
                        </div>
                    </div>

                    <div className="flex justify-end  self-end space-x-4">

                        <Button
                            onClick={handleVoltar}>
                            <span className="px-16">
                                Voltar
                            </span>
                        </Button>
                    </div>
                </div>

                :
                <div>
                    <h1>Nenhuma loja selecionada</h1>
                </div>
            }

        </div>
    );


}