import Input from "@/components/UI/Input";
import { useEffect } from "react";
import { useEventoStore } from "@/stores/evento";
import Button from "@/components/UI/Button";
import { DatePicker } from "@/components/UI/DatePicker";
import { usePaginaLojaStore } from "@/stores/paginaLoja";
import { useRouter } from "next/navigation";


export default function FormularioNovoEvento() {
    const { evento, setExibirFormularioEvento, validacaoErro, atualizarEvento, validarFormulario, clear, limparValidacao, salvarEvento } = useEventoStore();
    const { lojaSelecionada, fetchLoja } = usePaginaLojaStore();
    const router = useRouter();

    const lojaId = lojaSelecionada?.id;

    useEffect(() => {
        limparValidacao();
    }, [evento, limparValidacao]);


    const hanleChangeNomeEvento = (novoNome: string) => {
        const copiaEvento = { ...evento };
        copiaEvento.nmEvento = novoNome;
        atualizarEvento(copiaEvento);
    }

    const hanleChangeQuantidadeParticipantes = (valor: string) => {
        const copiaEvento = { ...evento };
        copiaEvento.qtdLimite = Number(valor);
        atualizarEvento(copiaEvento);
    }

    const handleSairFormulario = () => {
        clear();
        limparValidacao();
        setExibirFormularioEvento(false);
    }

    const handleCadastrarEvento = async () => {
        limparValidacao();
        if (validarFormulario()) {
            const resultado = await salvarEvento(evento!, lojaId!);

            if (!resultado.success) {
                return;
            }

            await fetchLoja(lojaId!)

            setExibirFormularioEvento(false);
            router.push(`/organizadorHome/loja/${lojaId}/eventos`);
        }

    }

    const handleChangeDataInicio = (novaData: Date | undefined) => {
        const copiaEvento = { ...evento };
        copiaEvento.dtInicio = novaData ? novaData.toISOString() : "";
        atualizarEvento(copiaEvento);
    }

    const handleChangeDataTermino = (novaData: Date | undefined) => {
        const copiaEvento = { ...evento };
        copiaEvento.dtFim = novaData ? novaData.toISOString() : "";
        atualizarEvento(copiaEvento);
    }

    if (!lojaId) {
        setExibirFormularioEvento(false);
        return null;
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

                    <div className=" grid grid-cols-4 gap-8">

                        <DatePicker
                            label="Data Início"
                            placeholder="início"
                            value={evento?.dtInicio ? new Date(evento.dtInicio) : undefined}
                            onChange={handleChangeDataInicio}
                            error={validacaoErro?.dataInicio}
                            required
                        />

                        <DatePicker
                            label="Data Término"
                            placeholder="término"
                            value={evento?.dtFim ? new Date(evento.dtFim) : undefined}
                            onChange={handleChangeDataTermino}
                            error={validacaoErro?.dataFim}
                            required
                        />

                        <Input
                            label="Quanditade máxima de Participantes"
                            number
                            autoComplete="quantidadeMaximaParticipantes"
                            value={evento?.qtdLimite?.toString() || "0"}
                            onChange={hanleChangeQuantidadeParticipantes}
                            required
                            error={validacaoErro?.quantidadeMaximaParticipantes}
                        // disabled={loading}
                        />

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