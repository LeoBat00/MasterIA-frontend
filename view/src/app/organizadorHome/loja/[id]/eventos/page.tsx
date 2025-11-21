"use client";

import { usePaginaLojaStore } from "@/stores/paginaLoja";
import { CardEvento } from "../CardEvento";
import Button from "@/components/UI/Button";
import { useRouter } from "next/navigation";
import { useEventoStore } from "@/stores/evento";
import FormularioNovoEvento from "./formularioNovoEvento";
import Select from "@/components/UI/Select";
import Input from "@/components/UI/Input";
import { filtroEvento, statusEvento, Evento } from "@/types/evento";
import { calcularStatus } from "../../../../util";

const isStatusTrue = (evento: Evento) => {
  const statusValue = evento.status as unknown;
  if (typeof statusValue === "boolean") return statusValue;
  return evento.status === "Ativo" || evento.status === "EmAndamento";
};

export default function PageEvento() {
  const { lojaSelecionada } = usePaginaLojaStore();
  const {
    exibirFormularioEvento,
    setExibirFormularioEvento,
    filtroEvento,
    atualizarFiltroEvento,
  } = useEventoStore();

  const optionsStatus = [
    { value: "todos", label: "Todos" },
    { value: "ativos", label: "Ativos" },
    { value: "inativos", label: "Inativos" },
    { value: "emAndamento", label: "Em Andamento" },
    { value: "finalizados", label: "Finalizados" },
    { value: "encerrados", label: "Encerrados" },
  ];

  const optionsOrdem = [
    { value: "maisRecente", label: "Mais recente" },
    { value: "maisAntigo", label: "Mais antigo" },
    { value: "A-Z", label: "A-Z" },
    { value: "Z-A", label: "Z-A" },
  ];

  const router = useRouter();

  const listaEventos = lojaSelecionada?.eventos || [];

  const FiltrarLista = (
    filtroEvento: filtroEvento | undefined,
    listaEventos: Evento[]
  ) => {
    if (!filtroEvento || listaEventos?.length === 0) return listaEventos;

    let eventosFiltrados = listaEventos;
    // Filtrar por nome ou código do evento
    if (filtroEvento.nomeEvento) {
      const termo = filtroEvento.nomeEvento.toLowerCase();
      eventosFiltrados = eventosFiltrados.filter(
        (evento) =>
          evento.nmEvento.toLowerCase().includes(termo) ||
          evento.cdEvento.toLowerCase().includes(termo)
      );
    }

    // Filtrar por status
    if (filtroEvento.status && filtroEvento.status !== "todos") {
      const agora = new Date();
      const hoje = new Date();
      hoje.setHours(0, 0, 0, 0);
      if (filtroEvento.status === "encerrados") {
        eventosFiltrados = eventosFiltrados.filter((evento) => {
          const fim = new Date(evento.dtFim);
          return fim < agora;
        });
      } else if (filtroEvento.status === "ativos") {
        eventosFiltrados = eventosFiltrados.filter((evento) =>
          isStatusTrue(evento)
        );
      } else if (filtroEvento.status === "emAndamento") {
        eventosFiltrados = eventosFiltrados.filter((evento) => {
          const inicio = new Date(evento.dtInicio);
          return isStatusTrue(evento) && inicio >= hoje;
        });
      } else {
        eventosFiltrados = eventosFiltrados.filter(
          (evento) => calcularStatus(evento) === filtroEvento.status
        );
      }
    }

    // Ordenar
    if (filtroEvento.ordem) {
      if (filtroEvento.ordem === "maisRecente") {
        eventosFiltrados = eventosFiltrados.sort(
          (a, b) =>
            new Date(b.dtInicio).getTime() - new Date(a.dtInicio).getTime()
        );
      } else if (filtroEvento.ordem === "maisAntigo") {
        eventosFiltrados = eventosFiltrados.sort(
          (a, b) =>
            new Date(a.dtInicio).getTime() - new Date(b.dtInicio).getTime()
        );
      } else if (filtroEvento.ordem === "A-Z") {
        eventosFiltrados = eventosFiltrados.sort((a, b) =>
          a.nmEvento.localeCompare(b.nmEvento)
        );
      } else if (filtroEvento.ordem === "Z-A") {
        eventosFiltrados = eventosFiltrados.sort((a, b) =>
          b.nmEvento.localeCompare(a.nmEvento)
        );
      }
    }
    return eventosFiltrados;
  };

  const listaEventosFiltrada = FiltrarLista(filtroEvento, listaEventos);
  const listaEventosOrdenada = [...listaEventosFiltrada].sort((a, b) => {
    const ativo = (ev: Evento) =>
      calcularStatus(ev) === "Ativo" || calcularStatus(ev) === "EmAndamento"
        ? 1
        : 0;
    return ativo(b) - ativo(a);
  });

  const quantidadeEventos = listaEventos.length;

  const handleVoltar = () => {
    router.back();
  };

  const handleChangeFiltroStatus = (opcao: string | number) => {
    atualizarFiltroEvento({ ...filtroEvento, status: opcao as statusEvento });
  };

  const handleChangeFiltroOrdem = (opcao: string | number) => {
    atualizarFiltroEvento({
      ...filtroEvento,
      ordem: opcao as "maisRecente" | "maisAntigo" | "A-Z" | "Z-A",
    });
  };

  const handleChangeNomeEvento = (novoNome: string) => {
    atualizarFiltroEvento({ ...filtroEvento, nomeEvento: novoNome });
  };

  const handleClickCardEvento = (idEvento: number) => {
    router.push(`/organizadorHome/loja/${lojaSelecionada?.id}/${idEvento}`);
  };
  return (
    <div className="page">
      {lojaSelecionada ? (
        <div className="pb-8">
          <div className="flex-1">
            <div id="tituloPaginaLoja" className="">
              <p className="mt-1 text-lg text-zinc-400 text-[14px]">
                Gerencie seus eventos
              </p>
              <div className="mt-2 border-b border-zinc-600 mb-4" />
            </div>
            {exibirFormularioEvento ? (
              <FormularioNovoEvento />
            ) : (
              <div>
                <div className="mb-2">
                  <span className="text-[24px] font-semibold text-[#D9E8FF]">
                    Eventos cadastrados{" "}
                    <span className="text-lg text-zinc-400/65">
                      {"( " + quantidadeEventos + " )"}
                    </span>
                  </span>
                </div>

                <div className="grid grid-cols-12 gap-4 items-end mb-6">
                  <div className="col-span-12 md:col-span-6">
                    <Input
                      label="Nome ou código do evento"
                      placeholder="Pesquisar evento"
                      value={filtroEvento?.nomeEvento || ""}
                      onChange={handleChangeNomeEvento}
                    />
                  </div>
                  <div className="col-span-6 md:col-span-3">
                    <Select
                      label="Status"
                      animateOptions={true}
                      allowTyping={false}
                      value={filtroEvento?.status || "todos"}
                      onChange={handleChangeFiltroStatus}
                      options={optionsStatus}
                    />
                  </div>
                  <div className="col-span-6 md:col-span-3">
                    <Select
                      label="Ordem"
                      animateOptions={true}
                      allowTyping={false}
                      value={filtroEvento?.ordem || "maisRecente"}
                      onChange={handleChangeFiltroOrdem}
                      options={optionsOrdem}
                      placeholder="Digite para filtrar..."
                    />
                  </div>
                </div>

                <div className="grid grid-cols-[repeat(auto-fit,minmax(250px,300px))] justify-start mb-6 gap-4">
                  {listaEventosOrdenada.length > 0 ? (
                    listaEventosOrdenada.map((evento) => (
                      <CardEvento
                        key={evento.id}
                        evento={evento}
                        onClick={(evento) => handleClickCardEvento(evento.id)}
                      />
                    ))
                  ) : (
                    <span className="text-zinc-400">Crie um novo evento</span>
                  )}
                </div>

                <div className="flex justify-end  self-end space-x-4">
                  <Button
                    id="botaoVoltarPaginaEvento"
                    variant="outlineGhost"
                    onClick={handleVoltar}
                  >
                    <span className="px-18">voltar</span>
                  </Button>
                  <Button onClick={() => setExibirFormularioEvento(true)}>
                    <span className="px-8">Cadastrar Evento</span>
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div>
          <h1>Nenhum evento selecionado</h1>
        </div>
      )}
    </div>
  );
}
