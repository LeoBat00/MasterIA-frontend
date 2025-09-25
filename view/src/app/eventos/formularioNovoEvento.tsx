import Input from "@/components/UI/Input";
import { FaCalendar } from "react-icons/fa";
import { useEffect } from "react";
import { useEventoStore } from "@/stores/evento";
import Button from "@/components/UI/Button";
import {DatePicker} from "@/components/UI/DatePicker";


export default function FormularioNovoEvento() {
    const { evento, setExibirFormularioEvento, validacaoErro, atualizarEvento, validarFormulario, clear, limparValidacao } = useEventoStore();

    useEffect(() => {
        limparValidacao();
    }, [limparValidacao]);

    const hanleChangeNomeEvento = (novoNome: string) => {
        const copiaEvento = { ...evento };
        copiaEvento.nmEvento = novoNome;
        atualizarEvento(copiaEvento);
    }

    const hanleChangeCidade = (novaCidade: string) => {
        // const copiaLoja = { ...loja };
        // copiaLoja.cidade = novaCidade;
        // atualizarLoja(copiaLoja);
    }

    const hanleChangeUf = (novoUf: string) => {
        // const copiaLoja = { ...loja };
        // copiaLoja.uf = novoUf;
        // atualizarLoja(copiaLoja);
    }
    const hanleChangeLogradouro = (novoLogradouro: string) => {
        // const copiaLoja = { ...loja };
        // copiaLoja.logradouro = novoLogradouro;
        // atualizarLoja(copiaLoja);
    }
    const hanleChangeBairro = (novoBairro: string) => {
        // const copiaLoja = { ...loja };
        // copiaLoja.bairro = novoBairro;
        // atualizarLoja(copiaLoja);
    }

    const handleChangeNumero = (novoNumero: string) => {
        // const copiaLoja = { ...loja };
        // copiaLoja.numero = novoNumero;
        // atualizarLoja(copiaLoja);
    }

    const handleSairFormulario = () => {
        console.log("Sair Formulario");
        clear();
        limparValidacao();
        setExibirFormularioEvento(false);
    }

    const handleCadastrarEvento = () => {
        clear();
        limparValidacao();
    }

    const handleChangeDataInicio = (novaData: Date | undefined) => {
        const copiaEvento = { ...evento };
        copiaEvento.dtInicio = novaData ? novaData.toISOString() : "";
        atualizarEvento(copiaEvento);
    }

    return <div className="py-8 px-32 bg-[var(--background-color-4)] rounded border-r border-b  border-[var(--color-purple-2)] border-l-8 border-l-[var(--color-purple-2)]  ">

        <div className="mb-6">
            <span className="texto-medium-md">Cadastrar Novo Evento </span>
            <p className="mt-1 text-lg text-zinc-400">Cadastre eventos para a sua loja e defina nome, datas, limite de participantes e status.</p>
        </div>
        <form
            className="flex flex-col gap-2 mt-4 px-8"
            onSubmit={async (e) => {
                e.preventDefault();
                handleCadastrarEvento();
            }}
        >
            <div className="grid grid-cols-1 gap-8">

                <div className="grid grid-cols-1 gap-8">
                    <div className="grid grid-cols-2 gap-8">
                        <Input
                            label="Nome do Evento"
                            autoComplete="nomeEvento"
                            value={evento?.nmEvento}
                            onChange={hanleChangeNomeEvento}
                            required
                            error={validacaoErro?.nomeEvento}
                        // disabled={loading}
                        />
                    </div>
                    <div className=" grid grid-cols-2 gap-8">

                        <Input
                            label="Descrição do Evento"
                            autoComplete="descEvento"
                            value={evento?.nmEvento}
                            onChange={hanleChangeNomeEvento}
                            error={validacaoErro?.nomeEvento}
                        // disabled={loading}
                        />

                    </div>

                    <div className=" grid grid-cols-4 gap-8">

                        <DatePicker
                            label="Data Início"
                            placeholder="início"
                            value={evento?.dtInicio ? new Date(evento.dtInicio) : undefined}
                            onChange={handleChangeDataInicio}
                            error="TESTE"
                            disabled={true}
                        />

                        {/* <Input
                            label="Endereço ou Logradouro"
                            autoComplete="logradouro"
                            placeholder="insira o endereço"
                            value={loja?.logradouro}
                            onChange={hanleChangeLogradouro}
                            containerClassName="col-span-3"
                            required
                            error={validacaoErro?.logradouro}
                        // disabled={loading}
                        />

                        <Input
                            label="Numero"
                            autoComplete="numero"
                            placeholder="insira o numero"
                            value={loja?.numero}
                            onChange={handleChangeNumero}
                            containerClassName="col-span-1"
                            number
                        // error={validacaoErro?.num}
                        // disabled={loading}
                        /> */}
                    </div>

                    <div className="">
                        {/* <Input
                            label="Bairro"
                            autoComplete="bairro"
                            placeholder="insira o bairro"
                            value={loja?.bairro}
                            onChange={hanleChangeBairro}
                            required
                            error={validacaoErro?.bairro}
                        // disabled={loading}
                        /> */}
                    </div>
                </div>
                <div className="justify-self-end  self-end space-x-4">
                    <Button
                        id="botaoVoltarFornmularioEvento"
                        variant="outlineGhost"
                        onClick={handleSairFormulario}>
                        <span className="px-18">
                            voltar
                        </span>
                    </Button>
                    <Button
                        type="submit">
                        <span className="px-8">
                            Cadastrar Evento
                        </span>
                    </Button>
                </div>


            </div>

            {/* {errorMsg && <p className="text-xs text-red-500">{errorMsg}</p>} */}

        </form>
    </div>;
}