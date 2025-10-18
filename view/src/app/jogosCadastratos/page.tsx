'use client';
import Table, { Column, FetchParams } from '@/components/UI/Table';
import { Jogo } from '@/types/jogo';
import { useJogosCadastradoStore } from '@/stores/jogosCadastrados';
import { useCallback } from 'react';

export default function JogosCadastrados() {

    const { jogos, fetchJogosPaginado, tamanhoPagina, totalItens } = useJogosCadastradoStore();


    const columns: Column<Jogo>[] = [
        { Header: "Nome", accessor: "nmJogo" },
        { Header: "Ano", accessor: "anoPublicacao" },
        { Header: "Tipo", accessor: "tpJogo" },
        { Header: "Jogadores", accessor: (row) => `${row.qtJogadoresMin} - ${row.qtJogadoresMax}` },
        { Header: "Categorias", accessor: (row) => (row.categorias || []).map((c) => c.nmCategoria).join(", ") },
        { Header: "Mecânicas", accessor: (row) => (row.mecanicas || []).map((m) => m.nmMecanica).join(", ") },
        { Header: "Temas", accessor: (row) => (row.temas || []).map((t) => t.nmTema).join(", ") },

    ];

    const buscarJogos = useCallback(
        async ({ page, pageSize }: FetchParams) => {
            await fetchJogosPaginado(page, pageSize);
        },
        [fetchJogosPaginado] // só muda se essa função mudar
    );


    return (
        <div className=' w-full w-max-[calc(100vw-2rem)]'>
            <Table<any>
                title="Jogos de Tabuleiro"
                columns={columns}
                data={jogos || []}
                total={totalItens}   // 🔑 total vem do store
                containerClassName="bg-[#12121B] p-4 rounded-lg"
                fetchData={buscarJogos}
                pageSizeOptions={[5, 10, 20, 50]}
                initialPageSize={tamanhoPagina}
                overlay="y"
                maxHeight="70vh"
            />
        </div>
    );
}
