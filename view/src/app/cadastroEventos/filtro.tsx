'use client';
import { useCadastroEventosStore } from '@/stores/cadastroEventos';
import Button from '@/components/UI/Button';
import Input from '@/components/UI/Input';
import { FaSearch } from 'react-icons/fa';
import { EventoPeriodo } from '@/stores/cadastroEventos';

export default function FiltroEventos() {

    const { filtroEventos, setFiltroEventos } = useCadastroEventosStore();



    const handleChangeCodigoEvento = (value: string) => {
        setFiltroEventos({
            ...filtroEventos,
            codigoEvento: value,
        });
    }

    const handleClickPeriodo = (periodo: EventoPeriodo) => {
        const periodoAtual = filtroEventos?.inPeriodo;
        setFiltroEventos({
            ...filtroEventos,
            inPeriodo: periodoAtual === periodo ? undefined : periodo,
        });
    }


    const getEstiloBotaoFiltro = (isAtivo?: boolean) => {
        return isAtivo ? '!bg-[#616EFF] !text-[#FFFFFF] !font-bold' : '!bg-transparent !text-[#D9E8FFA6]';
    }
    return (
        <div className='grid grid-cols-12 gap-4 mt-2 mb-6'>
            <div className='col-span-4'>
                <Input
                    leftIcon={<FaSearch className='h-5 w-5 text-gray-400' />}
                    placeholder="Buscar por codigo do evento"
                    onChange={handleChangeCodigoEvento}
                    value={filtroEventos?.codigoEvento || ''}
                />
            </div>

            <div className='col-span-1'>
                <Button
                    variant="outlineGhostPurple"
                    className={`!rounded-full w-full  ${getEstiloBotaoFiltro(filtroEventos?.inPeriodo === EventoPeriodo.HOJE)}`}
                    onClick={() => handleClickPeriodo(EventoPeriodo.HOJE)}

                >
                    Hoje
                </Button>
            </div>

            <div className='col-span-2'>
                <Button
                    variant='outlineGhostPurple'
                    className={`!rounded-full w-full  ${getEstiloBotaoFiltro(filtroEventos?.inPeriodo === EventoPeriodo.SEMANA)}`}
                    onClick={() => handleClickPeriodo(EventoPeriodo.SEMANA)}
                >
                    Nessa Semana
                </Button>
            </div>

            <div className='col-span-2'>
                <Button
                    variant='outlineGhostPurple'
                    className={`!rounded-full w-full  ${getEstiloBotaoFiltro(filtroEventos?.inPeriodo === EventoPeriodo.MES)}`}
                    onClick={() => handleClickPeriodo(EventoPeriodo.MES)}
                >
                    Nesse Mês
                </Button>
            </div>

            <div className='col-span-3'>
                <span>{ }</span>
            </div>

        </div>
    );
}