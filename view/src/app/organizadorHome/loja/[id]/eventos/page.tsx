'use client';

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


export default function PageEvento() {

    const { lojaSelecionada } = usePaginaLojaStore();
    const { exibirFormularioEvento, setExibirFormularioEvento, filtroEvento, atualizarFiltroEvento } = useEventoStore();

    const optionsStatus = [
        { value: 'todos', label: 'Todos' },
        { value: 'ativos', label: 'Ativos' },
        { value: 'inativos', label: 'Inativos' },
        { value: 'emAndamento', label: 'Em Andamento' },
        { value: 'finalizados', label: 'Finalizados' },
    ];

    const optionsOrdem = [
        { value: 'maisRecente', label: 'Mais recente' },
        { value: 'maisAntigo', label: 'Mais antigo' },
        { value: 'A-Z', label: 'A-Z' },
        { value: 'Z-A', label: 'Z-A' },
    ];

    const router = useRouter();

    const listaEventos = lojaSelecionada?.eventos || [];

    const FiltrarLista = (filtroEvento: filtroEvento | undefined, listaEventos: Evento[]) => {
        if (!filtroEvento || listaEventos?.length === 0) return listaEventos;

        let eventosFiltrados = listaEventos;
        // Filtrar por nome do evento
        if (filtroEvento.nomeEvento) {
            eventosFiltrados = eventosFiltrados.filter(evento =>
                evento.nmEvento.toLowerCase().includes(filtroEvento.nomeEvento!.toLowerCase())
            );
        }

        // Filtrar por código do evento
        if (filtroEvento.codigoEvento) {
            eventosFiltrados = eventosFiltrados.filter(evento =>
                evento.cdEvento.toLowerCase().includes(filtroEvento.codigoEvento!.toLowerCase())
            );
        }

        // Filtrar por status
        if (filtroEvento.status && filtroEvento.status !== 'todos') {
            eventosFiltrados = eventosFiltrados.filter(
                evento => calcularStatus(evento) === filtroEvento.status
            );
        }

        // Ordenar
        if (filtroEvento.ordem) {
            if (filtroEvento.ordem === 'maisRecente') {
                eventosFiltrados = eventosFiltrados.sort((a, b) => new Date(b.dtInicio).getTime() - new Date(a.dtInicio).getTime());
            }
            else if (filtroEvento.ordem === 'maisAntigo') {
                eventosFiltrados = eventosFiltrados.sort((a, b) => new Date(a.dtInicio).getTime() - new Date(b.dtInicio).getTime());
            }
            else if (filtroEvento.ordem === 'A-Z') {
                eventosFiltrados = eventosFiltrados.sort((a, b) => a.nmEvento.localeCompare(b.nmEvento));
            }
            else if (filtroEvento.ordem === 'Z-A') {
                eventosFiltrados = eventosFiltrados.sort((a, b) => b.nmEvento.localeCompare(a.nmEvento));
            }
        }
        return eventosFiltrados;
    }

    const listaEventosFiltrada = FiltrarLista(filtroEvento, listaEventos);

    const quantidadeEventos = listaEventos.length;

    const handleVoltar = () => {
        router.back();
    }

    const handleChangeFiltroStatus = (opcao: string | number) => {
        atualizarFiltroEvento({ ...filtroEvento, status: opcao as statusEvento });
    }

    const handleChangeFiltroOrdem = (opcao: string | number) => {
        atualizarFiltroEvento({ ...filtroEvento, ordem: opcao as "maisRecente" | "maisAntigo" | "A-Z" | "Z-A" });
    }

    const handleChangeNomeEvento = (novoNome: string) => {
        atualizarFiltroEvento({ ...filtroEvento, nomeEvento: novoNome });
    }

    const handleChangeCódigoEvento = (novoCodigo: string) => {
        atualizarFiltroEvento({ ...filtroEvento, codigoEvento: novoCodigo });
    }
    return (
        <div className="page">
            {lojaSelecionada ?
                <div className="pb-8">
                    <div className="flex-1">
                        <div id="tituloPaginaLoja" className="mb-6">
                            <p className="mt-1 text-lg text-zinc-400">Gerencie seus eventos</p>
                            <div className="mt-4 border-b border-zinc-600" />
                        </div>
                        {exibirFormularioEvento ?
                            <FormularioNovoEvento />
                            :
                            <div>
                                <div className="mb-6">
                                    <span className="texto-medium-md">Gerencias Eventos </span>
                                    <p className="mt-1 text-lg text-zinc-400">Cadastre eventos para a sua loja e defina nome, datas, limite de participantes e status.</p>
                                </div>

                                <div className="mb-6">
                                    <span className="texto-medium-md">Eventos cadastrados <span className="text-lg text-zinc-400">{"( " + quantidadeEventos + " )"}</span></span>
                                </div>

                                <div className="grid grid-cols-12 gap-4 mb-6">
                                    <div className="col-span-3">
                                        <Select
                                            label="Status"
                                            value={filtroEvento?.status || 'todos'}
                                            onChange={handleChangeFiltroStatus}
                                            options={optionsStatus}
                                            placeholder="Digite para filtrar..."
                                            helperText="Você pode digitar para filtrar, mas só escolhe clicando."
                                        />
                                    </div>
                                    <div className="col-span-3">

                                        <Select
                                            label="Ordem"
                                            value={filtroEvento?.ordem || 'maisRecente'}
                                            onChange={handleChangeFiltroOrdem}
                                            options={optionsOrdem}
                                            placeholder="Digite para filtrar..."
                                            helperText="Você pode digitar para filtrar, mas só escolhe clicando."
                                        />

                                    </div>
                                    <div className="col-span-3">

                                        <Input
                                            label="nome do evento"
                                            placeholder="Pesquisar evento"
                                            value={filtroEvento?.nomeEvento || ''}
                                            onChange={handleChangeNomeEvento}

                                        />
                                    </div>

                                    <div className="col-span-3">

                                        <Input
                                            label="Código do evento"
                                            placeholder="Pesquisar pelo código"
                                            value={filtroEvento?.codigoEvento || ''}
                                            onChange={handleChangeCódigoEvento}

                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-[repeat(auto-fit,minmax(250px,300px))] justify-start mb-6">
                                    {listaEventosFiltrada.length > 0 ? (
                                        listaEventosFiltrada.map((evento) => (
                                            <CardEvento
                                                key={evento.id}
                                                evento={evento}
                                                onClick={(e) => console.log("Evento clicado:", e)}
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
                                        onClick={handleVoltar}>
                                        <span className="px-18">
                                            voltar
                                        </span>
                                    </Button>
                                    <Button
                                        onClick={() => setExibirFormularioEvento(true)}>
                                        <span className="px-8">
                                            Cadastrar Evento
                                        </span>
                                    </Button>
                                </div>
                            </div>
                        }
                    </div>
                </div>

                :
                <div>
                    <h1>Nenhum evento selecionado</h1>
                </div>
            }

        </div>
    );


}