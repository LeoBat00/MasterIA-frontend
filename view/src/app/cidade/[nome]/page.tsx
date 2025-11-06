"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";
import {
  useCadastroEventosStore,
  EventoPeriodo,
} from "@/stores/cadastroEventos";
import Button from "@/components/UI/Button";
import { FaArrowLeft } from "react-icons/fa";
import FiltroEventos from "@/app/selecionarCidade/filtro";
import { Evento, EventoAtivo } from "@/types/evento";
import CardCadastroEvento from "@/components/Cards/CardCadastroEvento";
import Link from "next/link";
import { zerarHoras } from "@/app/util";
import { useEventosAtivosStore } from "@/stores/eventosAtivosStore";

export default function CidadePage() {
  const params = useParams();
  const router = useRouter();
  const { cidadeSelecionada, setCidadeSelecionada, filtroEventos } =
    useCadastroEventosStore();
  const nomeParam = params?.nome as string | string[] | undefined;
  const nome = Array.isArray(nomeParam) ? nomeParam[0] : nomeParam ?? "";

  useEffect(() => {
    if (nome && cidadeSelecionada !== nome) {
      setCidadeSelecionada(nome);
    }
  }, [nome, cidadeSelecionada, setCidadeSelecionada]);

  const { eventos, loading, fetch } = useEventosAtivosStore();

  useEffect(() => {
    if (!eventos || eventos.length === 0) {
      fetch();
    }
  }, [eventos?.length, fetch]);

  const filtrarEventos = (lista: EventoAtivo[]): EventoAtivo[] => {
    let eventosFiltrados = [...lista];

    if (filtroEventos?.codigoEvento) {
      eventosFiltrados = eventosFiltrados.filter((evento) =>
        evento.cdEvento
          .toLowerCase()
          .includes(filtroEventos.codigoEvento!.toLowerCase())
      );
    }

    if (filtroEventos?.inPeriodo) {
      switch (filtroEventos.inPeriodo) {
        case EventoPeriodo.HOJE: {
          const hoje = zerarHoras(new Date());
          eventosFiltrados = eventosFiltrados.filter((evento) => {
            const dataInicio = zerarHoras(new Date(evento.dtInicio));
            return dataInicio.getTime() === hoje.getTime();
          });
          break;
        }
        case EventoPeriodo.SEMANA: {
          const hoje = zerarHoras(new Date());
          const inicioSemana = zerarHoras(new Date(hoje));
          inicioSemana.setDate(hoje.getDate() - hoje.getDay());
          const fimSemana = zerarHoras(new Date(inicioSemana));
          fimSemana.setDate(inicioSemana.getDate() + 6);

          eventosFiltrados = eventosFiltrados.filter((evento) => {
            const dataInicio = zerarHoras(new Date(evento.dtInicio));
            return dataInicio >= inicioSemana && dataInicio <= fimSemana;
          });
          break;
        }

        case EventoPeriodo.MES: {
          const hoje = new Date();
          const inicioMes = zerarHoras(
            new Date(hoje.getFullYear(), hoje.getMonth(), 1)
          );
          const fimMes = zerarHoras(
            new Date(hoje.getFullYear(), hoje.getMonth() + 1, 0)
          );

          eventosFiltrados = eventosFiltrados.filter((evento) => {
            const dataInicio = zerarHoras(new Date(evento.dtInicio));
            return dataInicio >= inicioMes && dataInicio <= fimMes;
          });
          break;
        }
      }
    }

    return eventosFiltrados;
  };

  const eventosDaCidade = useMemo(() => {
    const nomeLower = (nome || "").toString().toLowerCase();
    const filtrados = filtrarEventos(eventos || []);
    return filtrados.filter((e) => (e.cidade || "").toLowerCase() === nomeLower);
  }, [eventos, nome, filtroEventos]);

  const mapToEvento = (e: EventoAtivo): Evento => ({
    id: e.id,
    nmEvento: e.nmEvento,
    cdEvento: e.cdEvento,
    dtInicio: e.dtInicio,
    dtFim: e.dtFim,
    // mapeia boolean para um status textual mínimo
    status: e.status ? "Ativo" : "Desativado",
    qtdLimite: e.qtdLimite,
    lojaId: e.lojaId,
    NomeLoja: e.nomeLoja,
    jogos: [],
    grupos: [],
  });

  return (
    <div className="min-h-screen pt-20 bg-[#1C172E]">
      <div className="mx-50 p-8">
        <Button
          variant="outlineGhostPurple"
          className="!rounded-full"
          onClick={() => router.push("/selecionarCidade")}
        >
          <FaArrowLeft className="h-5 w-5 mr-2" />
          Voltar
        </Button>

        <h1 className="titulo-pagina mt-5">
          Eventos acontecendo <br /> em
          <span className="text-[#616EFF] font-bold">
            {" "}
            {nome?.toUpperCase()}{" "}
          </span>
        </h1>

        <p>Filtrar por</p>
        <FiltroEventos />

        <div className="grid grid-cols-4 gap-4 mt-4">
          {loading && (
            <div className="col-span-4 p-4 bg-[#2F2B43] rounded-lg text-[#D9E8FF] opacity-70">
              Carregando eventos...
            </div>
          )}

          {!loading && eventosDaCidade.length === 0 && (
            <div className="col-span-4 p-4 bg-[#2F2B43] rounded-lg text-[#D9E8FF] opacity-70">
              Não há eventos ativos na sua cidade.
            </div>
          )}

          {!loading && eventosDaCidade.map((evento) => {
            const eMap = mapToEvento(evento);
            return (
              <Link
                href={`/selecionarCidade/${eMap.id}`}
                key={eMap.id}
                className=" hover:scale-105 transition-transform"
              >
                <CardCadastroEvento {...eMap} />
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
