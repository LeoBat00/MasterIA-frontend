import React from "react";
import clsx from "clsx";
import { ChevronRight } from "lucide-react";
import { Evento, statusEvento } from "../../../../types/evento";
import { calcularStatus, tempoRestante } from "../../../util";

const tipoStatusEvento: Record<
  statusEvento,
  { id: number; label: string; border: string; estilo: string }
> = {
  Ativo: {
    id: 1,
    label: "Faltam",
    border: "border-l-2 border-[var(--cor-status-ativo)]",
    estilo: "text-2xl font-regular",
  },
  Encerrado: {
    id: 2,
    label: "Evento",
    border: "border-l-2 border-[var(--cor-status-encerrado)]",
    estilo: "",
  },
  Desativado: {
    id: 3,
    label: "Evento",
    border: "border-l-2 border-[var(--cor-status-desativado)]",
    estilo: "",
  },
  EmAndamento: {
    id: 4,
    label: "Em andamento",
    border: "border-l-2 border-[var(--cor-status-em-andamento)]",
    estilo: "",
  },
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
        "p-4 rounded-md shadow-md bg-[#080809] flex flex-col gap-1 cursor-pointer transition duration-200 ease-out hover:-translate-y-1 hover:shadow-[0_12px_24px_rgba(0,0,0,0.35)] hover:bg-[#1c1c28] w-min-[256px]",
        config.border,
        statusAtual === "Ativo" || statusAtual === "EmAndamento"
          ? "opacity-100"
          : "opacity-60"
      )}
    >
      <div>
        <div className="flex justify-between items-center">
          <span className="text-[16px] font-semibold text-[#D9E8FF]">
            {nmEvento}
          </span>
          <span className="text-[14px] font-normal text-[#D9E8FF]">
            {config.label}
          </span>
        </div>
        <div className="flex justify-end items-left">
          <span className={clsx(config.estilo, "font-semibold text-[#fbfcff]")}>
            {tempoRestante(evento, statusAtual)}
          </span>
        </div>
        <div className="mb-4">
          <p className="text-[14px] font-normal text-[#D9E8FF]/70">Data</p>
          <span className="text-[14px] font-semibold text-[#D9E8FF]/70">
            {dataInicioFormatada}
          </span>
        </div>
        <div className="mb-4">
          <p className="text-[14px] font-normal text-[#D9E8FF]/70">
            Máximo de jogadores
          </p>
          <span className="text-[14px] font-semibold text-[#D9E8FF]/70">
            {evento.qtdLimite}
          </span>
        </div>
        <div className="mb-4">
          <p className="text-[14px] font-normal text-[#D9E8FF]/70">Código</p>
          <span className="text-[14px] font-semibold text-[#D9E8FF]/70">
            {evento.cdEvento}
          </span>
        </div>
        <div className="flex justify-end items-center mt-2">
          <span
            className={clsx(
              "text-sm flex items-center gap-1 cursor-pointer",
              statusAtual === "Encerrado" ? "text-[#FDC700]" : "text-purple-400"
            )}
          >
            Acessar evento
          </span>
          <ChevronRight
            className={clsx(
              "h-5 w-5",
              statusAtual === "Encerrado" ? "text-[#FDC700]" : "text-purple-400"
            )}
          />
        </div>
      </div>
    </div>
  );
}
