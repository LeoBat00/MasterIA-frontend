'use client';
import { formatarData, obterEnderecoCompleto } from '@/app/util';
import { Evento } from '@/types/evento';
import { Loja } from '@/types/loja';
import { FaStore, FaClock, FaCertificate, FaUser, FaPhone, FaVoicemail, FaEnvelope } from 'react-icons/fa';
import Input from '@/components/UI/Input';
import Button from '@/components/UI/Button';

export default function DetalheEventoCadastro() {

    const eventoMockado: Evento = {
        id: 1,
        nmEvento: "Evento de Teste",
        cdEvento: "EVT123",
        dtInicio: "2025-11-02T19:20:03",
        dtFim: "2025-11-10T19:20:03",
        status: "Ativo",
        lojaId: 1,
        NomeLoja: "Loja Exemplo",
        jogos: [],
        grupos: [],
    };

    const lojaMockada: Loja = {
        id: 1,
        nmLoja: "Loja Exemplo",
        logradouro: "Rua Exemplo",
        numero: "123",
        bairro: "Bairro Exemplo",
        cidade: "Cidade Exemplo",
        uf: "EX",
        cep: "12345-678",
    }

    return (
        <div className="min-h-screen bg-[#1C172E] pt-10 px-20">

            <div className="grid grid-cols-12 gap-4 px-4">
                <div className="col-span-6 flex flex-col gap-2 h-[80vh] justify-between pr-10">
                    <div>
                        <span className="titulo-pagina-evento mb-10">{eventoMockado.nmEvento}</span>
                        <div className="flex gap-2 mb-1 texto-medium-info !text-[#D9E8FF]">
                            <FaStore className='h-5 w-5' />
                            <span className="whitespace-nowrap">Local do Evento</span>
                            <span className='!text-[#ABB3BF]'> {obterEnderecoCompleto(lojaMockada)} </span>
                        </div>
                        <div className="flex items-center gap-2 mb-1 texto-medium-info !text-[#D9E8FF] !text-[18px]">
                            <FaClock />
                            <span className="whitespace-nowrap">Dia do Evento</span>
                            <span className='!text-[#ABB3BF]'> {formatarData(eventoMockado.dtInicio)} </span>
                        </div>

                        <div className="mt-4 border-b border-zinc-600" />
                    </div>
                    <div className='texto-organizador flex justify-end gap-2'>
                        Organizador
                        <span className='!font-semibold !text-[#616EFF] flex items-center gap-1'>
                            {eventoMockado.NomeLoja} <FaCertificate />
                        </span>
                    </div>
                </div>
                <div className="col-span-6 flex flex-col justify-center items-center gap-6 px-50">
                    <h1 className='titulo-pagina-evento '>Processo de inscrição</h1>
                    <div className="rounded-full w-fit px-8 py-1 bg-[var(--background-color-3)]">
                        <p className="text-xs text-center bg-[var(--text-color-1)] bg-clip-text text-transparent">
                            {"Passo 2 de 2"}
                        </p>
                    </div>
                    {/* porque essa linha nao aparece   */}
                    <div className="mt-4 w-full h-[1px] bg-zinc-600" />

                    <Input
                        label="Nome Completo"
                        containerClassName='!text-[#D9E8FF]'
                        rightIcon={<FaUser />}
                        onChange={(value) => { console.log(value) }}
                        value='TEste'
                    />

                    <Input
                        label="Email"
                        containerClassName='!text-[#D9E8FF]'
                        rightIcon={<FaEnvelope />}
                        onChange={(value) => { console.log(value) }}
                        value='TEste'
                    />

                    <Input
                        label="Telefone"
                        containerClassName='!text-[#D9E8FF]'
                        rightIcon={<FaPhone />}
                        onChange={(value) => { console.log(value) }}
                        value='TEste'
                    />

                    <div className=' flex justify-end gap-6 w-full mt-10'>

                        <Button
                            variant='outlineGhost'
                            className='min-w-30'
                            onClick={() => console.log("click voltar")}
                        >
                            Voltar
                        </Button>

                        <Button
                            className='min-w-30'
                            onClick={() => console.log("click prosseguir")}
                        >
                            Avançar
                        </Button>

                    </div>
                </div>
            </div>
        </div >
    )
}