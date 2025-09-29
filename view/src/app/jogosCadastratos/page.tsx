'use client';
import { PrivatePage } from '@/components/PrivatePage';
import Table, { Column, FetchParams } from '@/components/UI/Table';
import { Jogo } from '@/types/jogo';
import { FaPlus } from 'react-icons/fa';


export default function JogosCadastrados() {

    const mockJogos: Jogo[] = [
        {
            id: 1,
            nmJogo: "Catan",
            anoPublicacao: 1995,
            idadeMinima: 10,
            qtJogadoresMin: 3,
            qtJogadoresMax: 4,
            vlTempoJogo: 90,
            tpJogo: "Estratégia",
            thumb: "https://cf.geekdo-images.com/catan.jpg",
            categorias: [
                { id: 1, nmCategoria: "Construção de Território" },
                { id: 2, nmCategoria: "Gestão de Recursos" },
            ],
            mecanicas: [
                { id: 1, nmMecanica: "Troca de Recursos" },
                { id: 2, nmMecanica: "Rolagem de Dados" },
            ],
            temas: [{ id: 1, nmTema: "Civilização" }],
        },
        {
            id: 2,
            nmJogo: "Ticket to Ride",
            anoPublicacao: 2004,
            idadeMinima: 8,
            qtJogadoresMin: 2,
            qtJogadoresMax: 5,
            vlTempoJogo: 60,
            tpJogo: "Família",
            thumb: "https://cf.geekdo-images.com/ticket.jpg",
            categorias: [{ id: 3, nmCategoria: "Coleção de Componentes" }],
            mecanicas: [{ id: 3, nmMecanica: "Gestão de Mão" }],
            temas: [{ id: 2, nmTema: "Trens" }],
        },
        {
            id: 3,
            nmJogo: "Terraforming Mars",
            anoPublicacao: 2016,
            idadeMinima: 12,
            qtJogadoresMin: 1,
            qtJogadoresMax: 5,
            vlTempoJogo: 150,
            tpJogo: "Estratégia Pesada",
            thumb: "https://cf.geekdo-images.com/terraforming.jpg",
            categorias: [
                { id: 4, nmCategoria: "Gestão de Recursos" },
                { id: 5, nmCategoria: "Construção de Motor" },
            ],
            mecanicas: [
                { id: 4, nmMecanica: "Draft de Cartas" },
                { id: 5, nmMecanica: "Tabuleiro Modular" },
            ],
            temas: [{ id: 3, nmTema: "Espaço" }],
        },
        {
            id: 4,
            nmJogo: "Azul",
            anoPublicacao: 2017,
            idadeMinima: 8,
            qtJogadoresMin: 2,
            qtJogadoresMax: 4,
            vlTempoJogo: 40,
            tpJogo: "Abstrato",
            thumb: "https://cf.geekdo-images.com/azul.jpg",
            categorias: [{ id: 6, nmCategoria: "Quebra-cabeça" }],
            mecanicas: [{ id: 6, nmMecanica: "Draft Aberto" }],
            temas: [{ id: 4, nmTema: "Arte / Azulejos" }],
        },
    ];


    const columns: Column<Jogo>[] = [
        { Header: "Nome", accessor: "nmJogo" },
        { Header: "Ano", accessor: "anoPublicacao" },
        { Header: "Tipo", accessor: "tpJogo" },
        { Header: "Jogadores", accessor: (row) => `${row.qtJogadoresMin} - ${row.qtJogadoresMax}` },
        { Header: "Categorias", accessor: (row) => (row.categorias || []).map((c) => c.nmCategoria).join(", ") },
        { Header: "Mecânicas", accessor: (row) => (row.mecanicas || []).map((m) => m.nmMecanica).join(", ") },
        { Header: "Temas", accessor: (row) => (row.temas || []).map((t) => t.nmTema).join(", ") },
        {
            Header: "Ações",
            Cell: (row) => (
                <button
                    className="px-2 py-1 text-xs rounded bg-[var(--color-purple-5)] text-white hover:opacity-90 flex items-center gap-1"
                    onClick={() => alert(`Adicionar ${row.nmJogo}`)}
                >
                    <FaPlus /> Adicionar
                </button>
            ),
        },

    ];

    async function simularConsulta({ page, pageSize }: FetchParams) {
        const all = Array.from({ length: 123 }).map((_, i) => ({
            id: i + 1,
            nmJogo: `Jogo ${i + 1}`,
            anoPublicacao: 2000 + (i % 24),
            idadeMinima: 8 + (i % 10),
            qtJogadoresMin: 1 + (i % 4),
            qtJogadoresMax: 4 + (i % 6),
            vlTempoJogo: 30 + (i % 120),
            tpJogo: ["Estratégia", "Família", "Abstrato", "Aventura"][i % 4],
            thumb: `https://cf.geekdo-images.com/jogo${i + 1}.jpg`,
        }));
        const start = (page - 1) * pageSize;
        const end = start + pageSize;
        await new Promise((res) => setTimeout(res, 1000)); // simula delay
        return { items: all.slice(start, end), total: all.length };
    }

    return (
        <PrivatePage>
            <div className=' w-full w-max-[calc(100vw-2rem)]'>
                <Table<any>
                    title="Jogos de Tabuleiro"
                    columns={columns}
                    data={mockJogos}
                    containerClassName="bg-[#12121B] p-4 rounded-lg"
                    fetchData={simularConsulta}
                    pageSizeOptions={[5, 10, 20, 50,100]}
                    initialPageSize={10}
                    overlay='y'
                    maxHeight="70vh"
/>
            </div>
        </PrivatePage>
    );
}
