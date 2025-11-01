import React from "react";
import clsx from "clsx";
import { ChevronRight } from "lucide-react";
import { Evento, statusEvento } from "../../../../types/evento";
import { calcularStatus, tempoRestante } from "../../../util";

const tipoStatusEvento: Record<statusEvento, { id: number, label: string; border: string, estilo: string }> = {
    Ativo: { id: 1, label: "Faltam", border: "border-l-4 border-[var(--cor-status-ativo)]", estilo: "text-2xl font-bold" },
    Encerrado: { id: 2, label: "Evento", border: "border-l-4 border-[var(--cor-status-encerrado)]", estilo: "" },
    Desativado: { id: 3, label: "Evento", border: "border-l-4 border-[var(--cor-status-desativado)]", estilo: "" },
    EmAndamento: { id: 4, label: "Em andamento", border: "border-l-4 border-[var(--cor-status-em-andamento)]", estilo: "" },
};

type CardEventoProps = {
    evento: Evento;
    onClick?: (evento: Evento) => void;
};


export function CardEvento({ evento, onClick }: CardEventoProps) {
    const { nmEvento, dtInicio } = evento;
    const statusAtual = calcularStatus(evento);
    const config = tipoStatusEvento[statusAtual];
    // cor da borda dependendo do status

    const dataInicioFormatada = new Date(dtInicio).toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    });

    return (
        <div
            onClick={() => onClick?.(evento)}
            className={clsx(
                " p-4 rounded-md shadow-md bg-[#12121B] flex flex-col gap-1 cursor-pointer transition hover:bg-[#1c1c28] w-[256px]",
                config.border
            )}
        >
            <div>

                <div className="flex justify-between items-center">
                    <span>{nmEvento}</span>
                    <span>{config.label}</span>
                </div>
                <div className="flex justify-end items-left">
                    <span className={config.estilo}>{tempoRestante(evento, statusAtual)}
                    </span>
                </div>
                <div className="mb-4">
                    <p>Data</p>
                    <span>{dataInicioFormatada}</span>
                </div>
                <div className="mb-4">
                    <p>Máximo de jogadores</p>
                    <span>{evento.qtdLimite}</span>
                </div>
                <div className="mb-4">
                    <p>Código</p>
                    <span>{evento.cdEvento}</span>
                </div>
                <div className="flex justify-end items-center mt-2">
                    <span className='text-sm text-purple-400 flex items-center gap-1 cursor-pointer'>
                        Acessar evento
                    </span>
                    <ChevronRight className='h-5 w-5 text-purple-400 ' />
                </div>
            </div>

        </div>
    );
}
