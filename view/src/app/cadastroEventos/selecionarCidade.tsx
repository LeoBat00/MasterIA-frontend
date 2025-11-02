'use client';

import { useCadastroEventosStore } from '@/stores/cadastroEventos';
import Select from '@/components/UI/Select';
import Button from '@/components/UI/Button';
import { FaChevronRight } from 'react-icons/fa';


export default function SelecionarCidade() {

    const { cidadeSelecionada, setCidadeSelecionada } = useCadastroEventosStore();

    const cidades = [
        { value: 'sao-paulo', label: 'São Paulo' },
        { value: 'rio-de-janeiro', label: 'Rio de Janeiro' },
        { value: 'belo-horizonte', label: 'Belo Horizonte' },
    ];

    const cidadesRankedByEventos = [
        { value: 'sao-paulo', label: 'São Paulo' },
        { value: 'rio-de-janeiro', label: 'Rio de Janeiro' },
        { value: 'belo-horizonte', label: 'Belo Horizonte' },
        { value: 'sao-paulo2', label: 'São Paulo' },
        { value: 'rio-de-janeiro2', label: 'Rio de Janeiro' },
        { value: 'belo-horizonte2', label: 'Belo Horizonte' },
    ];

    const handleChangeCidade = (cidade: string | number) => {
        if (typeof cidade === 'string') {
            setCidadeSelecionada(cidade);
        }
    }

    return (
        <div className='w-[600px] bg-[#1E1B2E] p-6 rounded-lg shadow-lg border border-white/10'>
            <div>
                <h1 className="text-2xl font-bold mb-4">Seleciona sua cidade</h1>
                <Select
                    options={cidades}
                    value={cidadeSelecionada}
                    onChange={(value) => handleChangeCidade(value)}
                    placeholder='Buscar por nome'
                    containerClassName='mb-10'
                />

                <p className='mb-5 text-[#D9E8FFA6]'>Ordenado por quantidade de eventos</p>

                {cidadesRankedByEventos.map((cidade) => (
                    <div
                        key={cidade.value}
                        className="p-4 cursor-pointer bg-[#2F2B43] rounded-lg mb-2 hover:bg-white/20 text-[#D9E8FF]"
                        onClick={() => setCidadeSelecionada(cidade.value)}
                    >
                        {cidade.label}
                        <FaChevronRight className='h-5 w-5 text-[#D9E8FF] float-right' />

                    </div>
                ))}

                <div className="mt-4 border-b border-zinc-600" />

                <div className='flex justify-end gap-2 mt-4'>
                    <Button
                        variant='outlineGhost'
                        onClick={() => console.log(" voltar ")}
                    >
                        Voltar

                    </Button>

                    <Button
                        onClick={() => console.log(" todos os eventos ")}
                    >
                        Todos os eventos
                    </Button>

                </div>
            </div>

        </div>
    );
}