'use client';
import { PrivatePage } from '@/components/PrivatePage';
import Table, { Column, FetchParams } from '@/components/UI/Table';
import { Jogo, jogoLoja } from '@/types/jogo';
import { FaPlus } from 'react-icons/fa';
import { usePaginaLojaStore } from '@/stores/paginaLoja';
import { useJogosCadastradoStore } from '@/stores/jogosCadastrados';
import { useCallback, useEffect, useState } from 'react';
import Button from '@/components/UI/Button';
import { useLojaStore } from '@/stores/loja';
import { useRouter } from 'next/navigation';

export default function JogosLoja() {

    const { lojaSelecionada, fetchLoja } = usePaginaLojaStore();
    const { fetchJogosPaginado, tamanhoPagina, totalItens, jogos } = useJogosCadastradoStore();
    const { updateLoja } = useLojaStore();
    const [tamanhoPaginaLoja, setTamanhoPaginaLoja] = useState(10);
    const [totalItensLoja, setTotalItensLoja] = useState(0);
    const [listaDeJogosLoja, setListaDeJogosLoja] = useState<jogoLoja[]>(lojaSelecionada?.jogos?.slice(0, 10) || []);
    const [abaSelecionada, setAbaSelecionada] = useState(0); // 0 = Cadastro de Jogos, 1 = Jogos Cadastrados
    const navigater = useRouter();
    useEffect(() => {
        if (!lojaSelecionada) {
            navigater.push('/organizadorHome');
        }
    }, []);

    const buscarPaginadoJogosLoja = useCallback(
        async ({ page, pageSize }: FetchParams) => {
            try {
                const jogosLocal = lojaSelecionada?.jogos || [];

                const startIndex = (page - 1) * pageSize;
                const endIndex = page * pageSize;

                const pagina = jogosLocal.slice(startIndex, endIndex);

                const totalItens = jogosLocal.length;
                const totalPaginas = Math.ceil(totalItens / pageSize);

                setTotalItensLoja(totalItens);
                setTamanhoPaginaLoja(pageSize);
                setListaDeJogosLoja(pagina);

                return {
                    success: true,
                    data: pagina,
                    paginaAtual: page,
                    totalItens,
                    totalPaginas,
                };
            } catch (error) {
                console.error("Erro ao paginar jogos locais", error);
                return { success: false, error };
            }
        },
        [lojaSelecionada]
    );

    const handleAdicionarJogo = async (jogoId: number) => {
        if (!lojaSelecionada) {
            console.warn("Nenhuma loja selecionada.");
            return;
        }

        try {
            const lojaAtual = { ...lojaSelecionada };

            const jogosAtualizados = [
                ...(lojaAtual.jogos || []),
                { jogoId } as jogoLoja,
            ];

            const updateRes = await updateLoja({
                ...lojaAtual,
                jogos: jogosAtualizados,
            });

            if (!updateRes.success) {
                console.error("Erro ao atualizar loja:", updateRes.error);
                return;
            }

            if (lojaAtual.id) {
                const fetchRes = await fetchLoja(lojaAtual.id);

                if (!fetchRes.success) {
                    console.error("Erro ao buscar loja atualizada:", fetchRes.error);
                    return;
                }

                console.log("Loja atualizada com sucesso:", fetchRes.data);
            }
        } catch (err) {
            console.error("Erro inesperado ao adicionar jogo:", err);
        }
    };

    const handleRemoverJogo = async (codigoJogo: string) => {

        const lojaAtual = { ...lojaSelecionada };
        const jogosAtualizados = (lojaAtual.jogos || []).filter(j => j.codigoJogo !== codigoJogo);
        debugger
        const updateRes = await updateLoja({
            ...lojaAtual,
            jogos: jogosAtualizados,
        });

        if (!updateRes.success) {
            return;
        }

        if (lojaAtual.id) {
            const fetchRes = await fetchLoja(lojaAtual.id);
            if (!fetchRes.success) {
                return;
            }
        }

    };

    const buscarJogos = useCallback(
        async ({ page, pageSize }: FetchParams) => {
            await fetchJogosPaginado(page, pageSize);
        },
        [fetchJogosPaginado]
    );

    const columnsJogosCadastrados: Column<jogoLoja>[] = [
        { Header: "Nome", accessor: "nomeJogo" },
        { Header: "Jogadores", accessor: (row) => `${row.qtJogadoresMin} - ${row.qtJogadoresMax}` },
        { Header: "Categorias", accessor: (row) => (row.categorias || []).map((c) => c.nmCategoria).join(", ") },
        { Header: "Mecânicas", accessor: (row) => (row.mecanicas || []).map((m) => m.nmMecanica).join(", ") },
        { Header: "Código", accessor: "codigoJogo" },
        {
            Header: "Ações",
            Cell: (row) => (
                <Button
                    className="px-2 py-1 text-xs rounded bg-[var(--color-purple-5)] text-white hover:opacity-90 flex items-center gap-1"
                    onClick={() => handleRemoverJogo(row.codigoJogo)}
                >
                    <FaPlus /> Remover
                </Button>
            ),
        },

    ];

    const columnsJogosDoBanco: Column<Jogo>[] = [
        { Header: "Nome", accessor: "nmJogo" },
        { Header: "Jogadores", accessor: (row) => `${row.qtJogadoresMin} - ${row.qtJogadoresMin}` },
        { Header: "Categorias", accessor: (row) => (row.categorias || []).map((c) => c.nmCategoria).join(", ") },
        { Header: "Mecânicas", accessor: (row) => (row.mecanicas || []).map((m) => m.nmMecanica).join(", ") },
        { Header: "Código", accessor: "CodigoJogo" },
        {
            Header: "Ações",
            Cell: (row) => {
                const jogoJaAdicionado = (lojaSelecionada?.jogos || []).some(j => j.jogoId === row.id);
                if (jogoJaAdicionado) {
                    return <span className="text-sm text-green-500 font-medium">Adicionado</span>;
                };

                return (<Button
                    className="px-2 py-1 text-xs rounded bg-[var(--color-purple-5)] text-white hover:opacity-90 flex items-center gap-1"
                    onClick={() => handleAdicionarJogo(row.id)}
                >
                    <FaPlus /> Adicionar
                </Button>)
            },
        },

    ];


    const conteudoAbaJogosCadastrados = () => {
        return (
            <div>
                <Table<any>
                    title="Jogos Cadastrados na Loja"
                    key="tabela-jogos-cadastrados"
                    columns={columnsJogosCadastrados}
                    data={listaDeJogosLoja || []}
                    total={totalItensLoja}
                    containerClassName="bg-[#12121B] p-4 rounded-lg"
                    fetchData={buscarPaginadoJogosLoja}
                    pageSizeOptions={[5, 10, 20, 50]}
                    initialPageSize={tamanhoPaginaLoja}
                    overlay="y"
                    maxHeight="70vh"
                />
            </div>
        )
    }

    const conteudoAbaCadastroJogos = () => {
        return (
            <div>
                <Table<any>
                    title="Jogos do Banco de Dados"
                    key="tabela-jogos-banco"
                    columns={columnsJogosDoBanco}
                    data={jogos || []}
                    total={totalItens}
                    containerClassName="{bg-[#12121B]} p-4 rounded-lg"
                    fetchData={buscarJogos}
                    pageSizeOptions={[5, 10, 20, 50]}
                    initialPageSize={tamanhoPagina}
                    overlay="y"
                    maxHeight="70vh"
                />
            </div>
        )
    }

    return (
        <PrivatePage>
            <div className='page'>
                <div className='flex space-x-4'>
                    <Button id='btnAbaJogosCadastrados'
                        variant={abaSelecionada === 0 ? 'abaSelecionada' : 'aba'}
                        onClick={() => setAbaSelecionada(0)}
                        className={abaSelecionada === 0 ? 'btnAbaSelecionada' : 'btnAbaNormal'}>
                        Jogos Cadastrados
                    </Button>

                    <Button id='btnAbaCadastroJogos'
                        onClick={() => setAbaSelecionada(1)}
                        variant={abaSelecionada === 1 ? 'abaSelecionada' : 'aba'}
                        className={abaSelecionada === 1 ? '' : 'btnAbaNormal'}
                        >
                        Cadastro de Jogos
                    </Button>
                </div>

                <div className='border-2 border-[var(--color-purple-1)]'>
                    {abaSelecionada === 0 ? conteudoAbaJogosCadastrados() : conteudoAbaCadastroJogos()}
                </div>
            </div>
        </PrivatePage>
    );
}
