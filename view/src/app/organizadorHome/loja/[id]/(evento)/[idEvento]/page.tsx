'use client';

import { useEventoStore } from '@/stores/evento';

import { useParams } from 'next/navigation';
import { use, useEffect } from 'react';

export default function detalhesEventoPage() {

    const { eventoSelecionado, getEventoById, setEventoSelecionado } = useEventoStore();
    // const [isLoading, setIsLoading] = useState(true);
    const params = useParams(); // pega params da rota, ex: /loja/[id]
    const idEventoSelecionado = Number(params?.idEvento);

    useEffect(() => {
        if (idEventoSelecionado && getEventoById) {
            getEventoById(idEventoSelecionado).then((evento) => {
                if (evento) {
                    setEventoSelecionado(evento);
                } else {
                    console.log("Evento não encontrado");
                }
            });
        }
    }, [idEventoSelecionado, getEventoById, setEventoSelecionado]);

    return (
        <div className='page'>

            {eventoSelecionado ? (
                <div>
                    <div className="flex-1">

                        <p className="mt-1 text-lg text-zinc-400">Gerencie seu evento</p>
                        <div className="mt-2 border-b border-zinc-600 mb-8" />

                        <div className="flex items-center p-2 rounded-[8px] justify-between border border-[var(--color-purple-1)] px-4 mb-6">
                            <div className="text-lg font-medium text-zinc-500">
                                <div className="grid grid-cols-4 gap-y-1 p-3">
                                    <span className="font-medium">Código </span>
                                    <span>{eventoSelecionado.cdEvento}</span>
                                </div>
                            </div>
                        </div>

                        <div className="w-full flex gap-6 justify-between bg-[var(--background-color-6)] rounded-[8px] p-6 mb-6">

                            {/* <CardAtalho
                                onClick={handleClickGerenciarEventos}
                                icon={<FaCalendar />}
                                label="Gerenciar Eventos"
                            />
                            <CardAtalho
                                onClick={handleClickCadastroJogos}
                                icon={<FaChessBoard />}
                                label="Cadastro de Jogos"
                            />
                            <CardAtalho
                                onClick={() => console.log("Dados da loja")}
                                icon={<FaStore />}
                                label="Dados da Loja"
                            /> */}

                        </div>

                        {/* <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {listaEventosAtivos.length > 0 ? listaEventosAtivos.map(evento => (
                                <CardEvento
                                    key={evento.id}
                                    evento={evento}
                                    onClick={(e) => console.log("Evento clicado:", e)}
                                />
                            )) : <span className="text-zinc-400">Nenhum evento ativo</span>
                            }
                        </div> */}
                    </div>

                </div>
            ) : (<div>Evento não encontrado!</div>)}
        </div>
    );
}