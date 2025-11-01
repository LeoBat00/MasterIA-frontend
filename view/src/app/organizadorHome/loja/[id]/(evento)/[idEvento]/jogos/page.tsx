'use client';
import Table, { Column, FetchParams } from '@/components/UI/Table';
import { jogoEvento, jogoLoja } from '@/types/jogo';
import { FaPlus, FaTrash } from 'react-icons/fa';
import { usePaginaLojaStore } from '@/stores/paginaLoja';
import { useEventoStore } from '@/stores/evento';
import { useCallback, useEffect, useState, useRef } from 'react';
import Button from '@/components/UI/Button';
import { useRouter } from 'next/navigation';


export default function JogosEvento() {

    const { lojaSelecionada } = usePaginaLojaStore();
    const { eventoSelecionado, updateEvento, filtroBuscaJogos,
        isLoading, setIsLoading, getEventoById, setEventoSelecionado
    } = useEventoStore();

    const [tamanhoPagina, setTamanhoPagina] = useState(10);
    const [totalItensEvento, setTotalItensEvento] = useState(0);
    const [listaJogosEvento, setListaJogosEvento] = useState<jogoEvento[]>(eventoSelecionado?.jogos?.slice(0, 10) || []);
    const [listaJogosLoja, setListaJogosLoja] = useState<jogoLoja[]>(lojaSelecionada?.jogos?.slice(0, 10) || []);
    const [abaSelecionada, setAbaSelecionada] = useState(0);
    // const [todasMecanicas, setTodasMecanicas] = useState([]);
    // const [todosTemas, setTodosTemas] = useState([]);
    const router = useRouter();

    const filtroRef = useRef(filtroBuscaJogos);
    useEffect(() => { filtroRef.current = filtroBuscaJogos; }, [filtroBuscaJogos]);

    useEffect(() => {
        if (!eventoSelecionado || !lojaSelecionada) {
            router.push('/organizadorHome');
            return;
        }
        carregarMecanicasETemas();
    }, []);

    useEffect(() => {
        buscarPaginadoJogosEvento({ page: 1, pageSize: tamanhoPagina });
    }, [eventoSelecionado]);

    const carregarMecanicasETemas = async () => {
        // try {
        //     const [mecanicas, temas] = await Promise.all([getMecanicas(), getTemas()]);
        //     setTodasMecanicas(mecanicas.map((m: any) => ({ value: m.id, label: m.nmMecanica })));
        //     setTodosTemas(temas.map((t: any) => ({ value: t.id, label: t.nmTema })));
        // } catch (error) {
        //     console.error('Erro ao carregar mecânicas/temas:', error);
        // }
    };

    // ==== PAGINAÇÃO LOCAL PARA JOGOS DA LOJA ====
    const buscarPaginadoJogosLoja = useCallback(
        async ({ page, pageSize }: FetchParams) => {
            setIsLoading(true);
            const jogos = lojaSelecionada?.jogos || [];
            const start = (page - 1) * pageSize;
            const end = start + pageSize;
            setListaJogosLoja(jogos.slice(start, end));
            setTamanhoPagina(pageSize);
            setTotalItensEvento(jogos.length);
            setIsLoading(false);
            return {
                success: true,
                data: jogos.slice(start, end),
                paginaAtual: page,
                totalItens: jogos.length,
                totalPaginas: Math.ceil(jogos.length / pageSize),
            };
        },
        [lojaSelecionada]
    );

    // ==== PAGINAÇÃO LOCAL PARA JOGOS DO EVENTO ====
    const buscarPaginadoJogosEvento = useCallback(
        async ({ page, pageSize }: FetchParams) => {
            setIsLoading(true);
            const jogos = eventoSelecionado?.jogos || [];
            const start = (page - 1) * pageSize;
            const end = start + pageSize;
            const pagina = jogos.slice(start, end);
            setListaJogosEvento(pagina);
            setTotalItensEvento(jogos.length);
            setTamanhoPagina(pageSize);
            setIsLoading(false);
            return {
                success: true,
                data: pagina,
                paginaAtual: page,
                totalItens: jogos.length,
                totalPaginas: Math.ceil(jogos.length / pageSize),
            };
        },
        [eventoSelecionado]
    );

    // ==== ADICIONAR / REMOVER JOGOS NO EVENTO ====
    const handleAdicionarJogoAoEvento = async (jogoId: number) => {
        if (!eventoSelecionado) return;
        const jaExiste = eventoSelecionado.jogos?.some(j => j.jogoId === jogoId);
        if (jaExiste) return;

        const jogo = lojaSelecionada?.jogos?.find(j => j.jogoId === jogoId);
        if (!jogo) return;
        const novosJogos = [...(eventoSelecionado.jogos || []), jogo];
        const eventoAtualizado = { ...eventoSelecionado, jogos: novosJogos };
        const resultado = await updateEvento(eventoAtualizado);
        if (resultado.success) {
            getEventoById(eventoSelecionado.id).then((eventoAtualizado) => {
                if (eventoAtualizado) {
                    setListaJogosEvento(eventoAtualizado.jogos.slice(0, tamanhoPagina));
                    setEventoSelecionado(eventoAtualizado);
                }
            });
        }
    };

    const handleRemoverJogoDoEvento = async (jogoId: number) => {
        if (!eventoSelecionado) return;
        const novosJogos = (eventoSelecionado.jogos || []).filter(j => j.jogoId !== jogoId);
        const eventoAtualizado = { ...eventoSelecionado, jogos: novosJogos };
        const resultado = await updateEvento(eventoAtualizado);
        if (resultado.success) {
            getEventoById(eventoSelecionado.id).then((eventoAtualizado) => {
                if (eventoAtualizado) {
                    setListaJogosEvento(eventoAtualizado.jogos.slice(0, tamanhoPagina));
                    setEventoSelecionado(eventoAtualizado);
                }
            });
        }
    };

    // ==== TABELAS ====
    const columnsJogosEvento: Column<jogoEvento>[] = [
        { Header: 'Nome', accessor: 'nomeJogo' },
        { Header: 'Jogadores', accessor: (row) => `${row.qtJogadoresMin} - ${row.qtJogadoresMax}` },
        { Header: 'Temas', accessor: (row) => (row.temas || []).map(t => t.nmTema).join(', ') },
        { Header: 'Mecânicas', accessor: (row) => (row.mecanicas || []).map(m => m.nmMecanica).join(', ') },
        {
            Header: 'Ações',
            Cell: (row) => (
                <Button
                    className="px-2 py-1 text-xs rounded bg-red-600 text-white hover:opacity-90 flex items-center gap-1"
                    onClick={() => handleRemoverJogoDoEvento(row.jogoId)}
                >
                    <FaTrash /> Remover
                </Button>
            ),
        },
    ];

    const columnsJogosLoja: Column<jogoLoja>[] = [
        { Header: 'Nome', accessor: 'nomeJogo' },
        { Header: 'Jogadores', accessor: (row) => `${row.qtJogadoresMin} - ${row.qtJogadoresMax}` },
        { Header: 'Temas', accessor: (row) => (row.temas || []).map(t => t.nmTema).join(', ') },
        { Header: 'Mecânicas', accessor: (row) => (row.mecanicas || []).map(m => m.nmMecanica).join(', ') },
        {
            Header: 'Ações',
            Cell: (row) => {
                const jaAdicionado = (eventoSelecionado?.jogos || []).some(j => j.jogoId === row.jogoId);
                return jaAdicionado ? (
                    <span className="text-green-400 text-sm font-semibold">Adicionado</span>
                ) : (
                    <Button
                        className="px-2 py-1 text-xs rounded bg-[var(--color-purple-5)] text-white hover:opacity-90 flex items-center gap-1"
                        onClick={() => handleAdicionarJogoAoEvento(row.jogoId)}
                    >
                        <FaPlus /> Adicionar
                    </Button>
                );
            },
        },
    ];

    // ==== CONTEÚDO DAS ABAS ====
    const abaJogosEvento = (
        <Table
            title="Jogos do Evento"
            key="tabela-jogos-evento"
            columns={columnsJogosEvento}
            data={listaJogosEvento || []}
            total={totalItensEvento}
            containerClassName="bg-[#12121B] p-4 rounded-lg"
            fetchData={buscarPaginadoJogosEvento}
            pageSizeOptions={[5, 10, 20, 50]}
            initialPageSize={tamanhoPagina}
            loading={isLoading}
            overlay="y"
            maxHeight="60vh"
        />
    );

    const abaJogosLoja = (
        <Table
            title="Jogos Disponíveis da Loja"
            key="tabela-jogos-loja"
            columns={columnsJogosLoja}
            data={listaJogosLoja || []}
            total={lojaSelecionada?.jogos?.length || 0}
            containerClassName="bg-[#12121B] p-4 rounded-lg"
            fetchData={buscarPaginadoJogosLoja}
            pageSizeOptions={[5, 10, 20, 50]}
            initialPageSize={tamanhoPagina}
            loading={isLoading}
            overlay="y"
            maxHeight="60vh"
        />
    );

    return (
        <div className="page">
            <div className="flex space-x-4">
                <Button
                    variant={abaSelecionada === 0 ? 'abaSelecionada' : 'aba'}
                    onClick={() => setAbaSelecionada(0)}
                >
                    Jogos do Evento
                </Button>
                <Button
                    variant={abaSelecionada === 1 ? 'abaSelecionada' : 'aba'}
                    onClick={() => setAbaSelecionada(1)}
                >
                    Jogos da Loja
                </Button>
            </div>

            <div className="border-2 border-[var(--color-purple-1)] min-h-[400px]">
                {abaSelecionada === 0 ? abaJogosEvento : abaJogosLoja}
            </div>
        </div>
    );
}
