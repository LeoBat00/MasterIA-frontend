'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { calcularStatus, formatarData, getCorStatusEvento } from '@/app/util';
import { useEventoStore } from '@/stores/evento';
import { CardAtalho } from '@/components/Cards/CardAtalho';
import { FaUser, FaChessBoard, FaCalendar } from 'react-icons/fa';
import LoadingOverlay from '@/components/UI/LoadingOverlay';

export default function DetalhesEventoPage() {
    const EnumStateEvento = {
        Ativo: 'Ativo',
        Encerrado: 'Encerrado',
        Desativado: 'Desativado',
        EmAndamento: 'Em andamento',
    };

    const {
        eventoSelecionado,
        getEventoById,
        setEventoSelecionado,
        clear,
    } = useEventoStore();

    const params = useParams();
    const idEventoSelecionado = Number(params?.idEvento);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let ativo = true;
        setIsLoading(true);

        if (idEventoSelecionado && getEventoById) {
            getEventoById(idEventoSelecionado)
                .then((evento) => {
                    if (ativo && evento) {
                        setEventoSelecionado(evento);
                    }
                })
                .finally(() => {
                    if (ativo) setIsLoading(false);
                });
        }

        return () => {
            ativo = false;
            clear?.();
        };
    }, [idEventoSelecionado, getEventoById, setEventoSelecionado, clear]);

    if (isLoading) {
        return <LoadingOverlay />;
    }

    if (!eventoSelecionado) {
        return <div className="page">Evento não encontrado!</div>;
    }

    const status = calcularStatus(eventoSelecionado);
    const corStatus = getCorStatusEvento(status);

    const handleClickGerenciasJogos = () => {
        console.log("Gerenciar Jogos do Evento");
    }

    const handleClickParticipantes = () => {
        console.log("Gerenciar Participantes do Evento");
    }

    const handleClickDadosDoEvento = () => {
        console.log("Dados do Evento");
    }

    return (
        <div className="page">
            <div className="flex-1">
                <p className="mt-1 text-lg text-zinc-400">Gerencie seu evento</p>
                <div className="mt-2 border-b border-zinc-600 mb-8" />

                <p className="texto-medium-md mb-1">{eventoSelecionado.nmEvento}</p>

                <div className="flex items-start p-2 rounded-[8px] border border-[var(--color-border-ligh-purple)] px-4 mb-6">
                    <div className="text-lg font-medium text-[var(--text-color-info)]">
                        <div className="grid grid-cols-2 gap-y-1 gap-x-4 p-3">
                            <span>
                                Código: <span className="px-2">{eventoSelecionado.cdEvento}</span>
                            </span>

                            <span>
                                Status:{' '}
                                <span className="px-2 font-semibold" style={{ color: corStatus }}>
                                    {EnumStateEvento[status as keyof typeof EnumStateEvento]}
                                </span>
                            </span>

                            <span>
                                Pessoas Cadastradas:{' '}
                                <span className="px-2">{eventoSelecionado.qtdLimite}</span>
                            </span>

                            <span>
                                Data:{' '}
                                <span className="px-2">
                                    {formatarData(eventoSelecionado.dtInicio)}
                                </span>
                            </span>
                        </div>
                    </div>
                </div>

                <div className="w-full flex gap-6 justify-between bg-[var(--background-color-6)] rounded-[8px] p-6 mb-6">
                    <CardAtalho
                        onClick={handleClickGerenciasJogos}
                        icon={<FaChessBoard />}
                        label="Jogos do Evento"
                    />
                    <CardAtalho
                        onClick={handleClickParticipantes}
                        icon={<FaUser />}
                        label="Participantes"
                    />
                    <CardAtalho
                        onClick={handleClickDadosDoEvento}
                        icon={<FaCalendar />}
                        label="Dados do Evento"
                    />
                </div>
            </div>
        </div>
    );
}
