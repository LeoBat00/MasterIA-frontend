"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import {
  useCadastroEventosStore,
  EventoPeriodo,
} from "@/stores/cadastroEventos";
import Button from "@/components/UI/Button";
import { FaArrowLeft } from "react-icons/fa";
import FiltroEventos from "@/app/selecionarCidade/filtro";
import { Evento } from "@/types/evento";
import CardCadastroEvento from "@/components/Cards/CardCadastroEvento";
import Link from "next/link";
import { zerarHoras } from "@/app/util";

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

  const mockEventos: Evento[] = [
    {
      id: 1,
      nmEvento: "Evento 1",
      cdEvento: "EVT001",
      dtInicio: "2025-11-02T19:20:03",
      dtFim: "2025-11-02T19:20:03",
      status: "Ativo",
      lojaId: 1,
      NomeLoja: "Loja Exemplo 1",
      jogos: [],
      grupos: [],
    },
    {
      id: 2,
      nmEvento: "Evento 2",
      cdEvento: "EVT002",
      dtInicio: "2025-11-03T19:20:03",
      dtFim: "2025-09-13T19:20:03",
      status: "EmAndamento",
      lojaId: 1,
      NomeLoja: "Loja Exemplo 1",
      jogos: [],
      grupos: [],
    },
    {
      id: 3,
      nmEvento: "Evento 3",
      cdEvento: "EVT003",
      dtInicio: "2025-11-20T19:20:03",
      dtFim: "2025-09-13T19:20:03",
      status: "Encerrado",
      lojaId: 2,
      NomeLoja: "Loja Exemplo 2",
      jogos: [],
      grupos: [],
    },
    {
      id: 4,
      nmEvento: "Evento 4",
      cdEvento: "EVT004",
      dtInicio: "2025-09-13T19:20:03",
      dtFim: "2025-09-13T19:20:03",
      status: "Desativado",
      lojaId: 2,
      NomeLoja: "Loja Exemplo 2",
      jogos: [],
      grupos: [],
    },
    {
      id: 5,
      nmEvento: "Evento 5",
      cdEvento: "EVT005",
      dtInicio: "2025-09-13T19:20:03",
      dtFim: "2025-09-13T19:20:03",
      status: "Ativo",
      lojaId: 3,
      jogos: [],
      grupos: [],
    },
  ];

  const filtrarEventos = (eventos: Evento[]): Evento[] => {
    let eventosFiltrados = [...eventos];

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
          {filtrarEventos(mockEventos).map((evento) => (
            <Link
              href={`/cadastroEventos/${evento.id}`}
              key={evento.id}
              className=" hover:scale-105 transition-transform"
            >
              <CardCadastroEvento {...evento} />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
