'use client';

import { usePaginaLojaStore } from "@/stores/paginaLoja";
import { FaGear } from "react-icons/fa6";
import { FaStore, FaChessBoard, FaCalendar } from "react-icons/fa"
import { CardEvento } from "../loja/[id]/CardEvento";
import { useEffect } from "react";
import { useParams } from "next/navigation";
import { calcularStatus } from "../util";
import Button from "@/components/UI/Button";
import { useRouter } from "next/navigation";
import { useEventoStore } from "@/stores/evento";
import FormularioNovoEvento from "./formularioNovoEvento";
import Select from "@/components/UI/Select";
import { useState } from "react";
import Input from "@/components/UI/Input";
import { statusEvento } from "@/types/evento";


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
    const quantidadeEventos = listaEventos.length;

    const handleVoltar = () => {
        router.back();
    }

    const handleChangeFiltroStatus = (opcao: string) => {
        atualizarFiltroEvento({ ...filtroEvento, status: opcao as statusEvento });
    }

    const handleChangeFiltroOrdem = (opcao: string) => {
        atualizarFiltroEvento({ ...filtroEvento, ordem: opcao as "asc" | "desc" });
    }

    const handleChangeNomeEvento = (novoNome: string) => {
        atualizarFiltroEvento({ ...filtroEvento, nomeEvento: novoNome });
    }
    return (
        <div className="page">
            {lojaSelecionada ?
                <div className="pb-8">
                    <div className="flex-1">
                        <div id="tituloPaginaLoja" className="mb-6">
                            <span className="texto-light">{lojaSelecionada.logradouro}</span>
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
                                    <div className="col-span-6">

                                        <Input
                                            label="nome do evento"
                                            placeholder="Pesquisar evento"
                                            value={filtroEvento?.nomeEvento || ''}
                                            onChange={handleChangeNomeEvento}

                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-[repeat(auto-fit,minmax(250px,300px))] justify-start mb-6">
                                    {listaEventos.length > 0 ? (
                                        listaEventos.map((evento) => (
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