import Input from "@/components/UI/Input";
import { useLojaStore } from "@/stores/loja";
import { useAuthStore } from "@/stores/auth";
import { useOrganizadorStore } from "@/stores/organizador";
import { Eraser, Plus } from "lucide-react";
import { useEffect } from "react";

export default function FormularioNovaLoja() {

    const { loja, atualizarLoja, setExibirFormularioLoja, validacaoErro, validarFormulario, saveLoja, clear, limparValidacao, updateLoja } = useLojaStore();
    const { fetchOrganizador } = useOrganizadorStore();
    const { claims } = useAuthStore();
    const organizadorId = claims?.nameid ? Number(claims.nameid) : undefined;

    useEffect(() => {
        limparValidacao();
    }, [limparValidacao ]);

    const hanleChangeCep = (novoCep: string) => {
        const copiaLoja = { ...loja };
        copiaLoja.cep = novoCep;
        atualizarLoja(copiaLoja);
    }

    const hanleChangeCidade = (novaCidade: string) => {
        const copiaLoja = { ...loja };
        copiaLoja.cidade = novaCidade;
        atualizarLoja(copiaLoja);
    }

    const hanleChangeUf = (novoUf: string) => {
        const copiaLoja = { ...loja };
        copiaLoja.uf = novoUf;
        atualizarLoja(copiaLoja);
    }
    const hanleChangeLogradouro = (novoLogradouro: string) => {
        const copiaLoja = { ...loja };
        copiaLoja.logradouro = novoLogradouro;
        atualizarLoja(copiaLoja);
    }
    const hanleChangeBairro = (novoBairro: string) => {
        const copiaLoja = { ...loja };
        copiaLoja.bairro = novoBairro;
        atualizarLoja(copiaLoja);
    }

    const handleChangeNumero = (novoNumero: string) => {
        const copiaLoja = { ...loja };
        copiaLoja.numero = novoNumero;
        atualizarLoja(copiaLoja);
    }

    const handleSairFormulario = () => {
        clear();
        limparValidacao();
        setExibirFormularioLoja(false);
    }

    const handleCadastrarLoja = async () => {

        const formValido = validarFormulario();
        if (!formValido) return;
        if (!organizadorId) {
            alert("ID do organizador não encontrado. Faça login novamente.");
            return;
        }

        const resultado = loja?.id ? await updateLoja(loja!) : await saveLoja(loja!, organizadorId);

        if (!resultado.success) {
            alert("Erro ao cadastrar loja. Tente novamente.");
            return;
        }

        await fetchOrganizador(organizadorId);
        atualizarLoja({});
        setExibirFormularioLoja(false);
    }

    const handleLimparCampos = () => {
        clear();
        limparValidacao();
    }

    return <div className="py-8 px-32 bg-[var(--background-color-4)] rounded border-r border-b  border-[var(--color-purple-2)] border-l-8 border-l-[var(--color-purple-2)]  ">

        <h3 className="text-lg font-semibold mb-4">{loja?.id ? "Atualizar Loja" : "Cadastrar Nova Loja" }</h3>
        <form
            className="flex flex-col gap-2 mt-4 px-8"
            onSubmit={async (e) => {
                e.preventDefault();
                handleCadastrarLoja();
            }}
        >
            <div className="grid grid-cols-1 gap-8">

                <div className="grid grid-cols-1 gap-8">
                    <div className="grid grid-cols-2 gap-8">

                        <Input
                            label="Cep"
                            autoComplete="cep"
                            placeholder="insira o cep"
                            value={loja?.cep}
                            onChange={hanleChangeCep}
                            mask="00000-000"
                            required
                            number
                            error={validacaoErro?.cep}
                        // disabled={loading}
                        />
                    </div>
                    <div className=" grid grid-cols-2 gap-8">

                        <Input
                            label="Cidade"
                            autoComplete="cidade"
                            placeholder="insira a cidade"
                            value={loja?.cidade}
                            onChange={hanleChangeCidade}
                            required
                            error={validacaoErro?.cidade}
                        // disabled={loading}
                        />


                        <Input
                            label="Estado"
                            autoComplete="estado"
                            placeholder="insira o estado"
                            value={loja?.uf}
                            onChange={hanleChangeUf}
                            required
                            error={validacaoErro?.uf}
                        // disabled={loading}
                        />
                    </div>

                    <div className=" grid grid-cols-4 gap-8">

                        <Input
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
                        />
                    </div>

                    <div className="">
                        <Input
                            label="Bairro"
                            autoComplete="bairro"
                            placeholder="insira o bairro"
                            value={loja?.bairro}
                            onChange={hanleChangeBairro}
                            required
                            error={validacaoErro?.bairro}
                        // disabled={loading}
                        />
                    </div>
                </div>
                <div className="justify-self-end  self-end space-x-4">
                    <button
                        type="button"
                        // disabled={loading}
                        onClick={handleSairFormulario}
                        className="bg-[var(--color-button-secondary)] cursor-pointer rounded-[8px] text-black py-2 px-8 hover:opacity-90 mt-8 disabled:opacity-60 w-64 text-center"
                    >
                        Voltar
                    </button>

                    <button
                        type="submit"
                        // disabled={loading}
                        className="bg-[var(--color-button-primary)] cursor-pointer rounded-[8px] text-black py-2 px-8 hover:opacity-90 mt-8 disabled:opacity-60 w-64 text-center"
                    >
                        Cadastrar Loja
                    </button>
                </div>


            </div>

            {/* {errorMsg && <p className="text-xs text-red-500">{errorMsg}</p>} */}

        </form>

    </div>;
}