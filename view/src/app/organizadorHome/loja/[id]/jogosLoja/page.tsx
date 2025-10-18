'use client';
import Table, { Column, FetchParams } from '@/components/UI/Table';
import { Jogo, jogoLoja } from '@/types/jogo';
import { FaPlus } from 'react-icons/fa';
import { usePaginaLojaStore } from '@/stores/paginaLoja';
import { useJogosCadastradoStore } from '@/stores/jogosCadastrados';
import { useCallback, useEffect, useState, useRef } from 'react';
import Button from '@/components/UI/Button';
import { useLojaStore } from '@/stores/loja';
import { useRouter } from 'next/navigation';
import Select from '@/components/UI/Select';
import Input from '@/components/UI/Input';
import Checkbox from '@/components/UI/Checkbox';


export default function JogosLoja() {

    const { lojaSelecionada, fetchLoja, filtroBuscaJogosBanco, atualizarFiltroBusca, limparFiltroBusca } = usePaginaLojaStore();
    const { fetchJogosPaginado, tamanhoPagina, totalItens, jogos } = useJogosCadastradoStore();
    const { updateLoja } = useLojaStore();
    const [tamanhoPaginaLoja, setTamanhoPaginaLoja] = useState(10);
    const [totalItensLoja, setTotalItensLoja] = useState(0);
    const [listaDeJogosLoja, setListaDeJogosLoja] = useState<jogoLoja[]>(lojaSelecionada?.jogos?.slice(0, 10) || []);
    const [abaSelecionada, setAbaSelecionada] = useState(0); // 0 = Cadastro de Jogos, 1 = Jogos Cadastrados
    const navigater = useRouter();

    const filtroRef = useRef(filtroBuscaJogosBanco);

    useEffect(() => {
        filtroRef.current = filtroBuscaJogosBanco;
    }, [filtroBuscaJogosBanco]);

    const tiposMecanicas = [
        { value: 1, label: "Todas" },
        { value: 2, label: "Competitivo" },
        { value: 3, label: "Solo" },
        { value: 4, label: "Equipe" },
    ];

    const tiposCategorias = [
        { value: 1, label: "Todas" },
        { value: 2, label: "Competitivo" },
        { value: 3, label: "Solo" },
        { value: 4, label: "Equipe" },
    ];

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

    const pesquisarJogos = async () => {
        await fetchJogosPaginado(1, tamanhoPagina, filtroRef.current);
    }


    const buscarJogos = useCallback(
        async ({ page, pageSize }: FetchParams) => {

            await fetchJogosPaginado(page, pageSize, filtroBuscaJogosBanco);
        },
        [fetchJogosPaginado]
    );

    const handleChangeMecanicas = (novaMecanica: string | number) => {

        const novoFiltro = { ...filtroBuscaJogosBanco, mecanicasIds: [Number(novaMecanica)] };
        atualizarFiltroBusca(novoFiltro);
    }

    const handleChangeCategorias = (novaCategoria: string | number) => {
        const novoFiltro = { ...filtroBuscaJogosBanco, categoriasIds: [Number(novaCategoria)] };
        atualizarFiltroBusca(novoFiltro);
    }

    const handleChangeNomeJogo = (novoNome: string) => {
        const novoFiltro = { ...filtroBuscaJogosBanco, nmJogo: novoNome };
        atualizarFiltroBusca(novoFiltro);
    }

    const handleChangeCheckboxExibirJogosAdicionados = (valor: string | number, checked: boolean) => {
        const novoFiltro = { ...filtroBuscaJogosBanco };
        if (checked) {
            novoFiltro.lojaId = lojaSelecionada?.id;
        } else {
            delete novoFiltro.lojaId;
        }
        atualizarFiltroBusca(novoFiltro);
    }

    const handleLimparCampos = () => {
        limparFiltroBusca();
    }

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
            <div className='flex flex-col gap-4'>
                <div id='filtroTabelaCadastroJogos' className=''>
                    <div className='grid grid-cols-12 gap-4 p-4 justify-start w-fit'>
                        <div className='col-span-3'>
                            <Select
                                label="Mecânicas"
                                value={filtroBuscaJogosBanco?.mecanicasIds?.[0] ?? ''}
                                onChange={handleChangeMecanicas}
                                options={tiposMecanicas}
                                helperText="Você pode digitar para filtrar, mas só escolhe clicando."
                            />
                        </div>

                        <div className='col-span-3'>
                            <Select
                                label="Categorias"
                                value={filtroBuscaJogosBanco?.categoriasIds?.[0] ?? ''}
                                onChange={handleChangeCategorias}
                                options={tiposCategorias}
                                helperText="Você pode digitar para filtrar, mas só escolhe clicando."
                            />
                        </div>

                        <div className='col-span-3'>
                            <Input
                                label="nome do jogo"
                                placeholder="Pesquisar jogo"
                                value={filtroBuscaJogosBanco?.nmJogo || ''}
                                onChange={handleChangeNomeJogo}
                            />
                        </div>

                        <div className='col-span-3 items-center flex'>
                            <Checkbox
                                id='checkExibirJogosAdicionados'
                                values={filtroBuscaJogosBanco?.lojaId ? ['1'] : []}
                                onChange={handleChangeCheckboxExibirJogosAdicionados}
                                items={[{ value: '1', label: 'Exibir apenas jogos não adicionados' }]}
                                columns={1}

                            >

                            </Checkbox>
                        </div>
                    </div>

                    <div className='flex justify-end pr-8 gap-4'>
                        <Button
                            onClick={handleLimparCampos}
                            variant="outlineGhost"
                            size='md'
                        >
                            Limpar
                        </Button>

                        <Button
                            onClick={() => pesquisarJogos()}
                            variant="primary"
                            size='md'
                        >
                            Pesquisar
                        </Button>
                    </div>
                </div>

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
    );
}
