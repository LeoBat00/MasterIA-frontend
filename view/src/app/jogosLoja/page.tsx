'use client';
import { PrivatePage } from '@/components/PrivatePage';
import Table, { Column, FetchParams } from '@/components/UI/Table';
import { jogoLoja } from '@/types/jogo';
import { FaPlus } from 'react-icons/fa';
import { usePaginaLojaStore } from '@/stores/paginaLoja';

export default function JogosLoja() {

    const { lojaSelecionada } = usePaginaLojaStore();

    const jogos = lojaSelecionada?.jogos || [];



    const columns: Column<jogoLoja>[] = [
        { Header: "Nome", accessor: "nomeJogo" },
        { Header: "Jogadores", accessor: (row) => `${row.qtdJogadoresMin} - ${row.qtdJogadoresMax}` },
        { Header: "Categorias", accessor: (row) => (row.categorias || []).map((c) => c.nmCategoria).join(", ") },
        { Header: "Mecânicas", accessor: (row) => (row.mecanicas || []).map((m) => m.nmMecanica).join(", ") },
        {
            Header: "Ações",
            Cell: (row) => (
                <button
                    className="px-2 py-1 text-xs rounded bg-[var(--color-purple-5)] text-white hover:opacity-90 flex items-center gap-1"
                    onClick={() => alert(`Adicionar ${row.nomeJogo}`)}
                >
                    <FaPlus /> Adicionar
                </button>
            ),
        },

    ];

    return (
        <PrivatePage>
            <div className=' w-full w-max-[calc(100vw-2rem)]'>
                <Table<any>
                    title="Jogos Cadastrados na Loja"
                    columns={columns}
                    data={jogos}
                    containerClassName="bg-[#12121B] p-4 rounded-lg"
                    pageSizeOptions={[5, 10, 20, 50]}
                    initialPageSize={10}
                    overlay='y'
                    maxHeight="70vh"
/>
            </div>
        </PrivatePage>
    );
}
