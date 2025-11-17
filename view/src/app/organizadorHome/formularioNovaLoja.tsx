import Input from "@/components/UI/Input";
import Button from "@/components/UI/Button";
import { Eraser } from "lucide-react";
import { useLojaStore } from "@/stores/loja";
import { useAuthStore } from "@/stores/auth";
import { useOrganizadorStore } from "@/stores/organizador";
import { fetchAddressByCep } from "@/services/cepService";
import { Loja } from "@/types/loja";
import { useEffect, useState } from "react";

export default function FormularioNovaLoja() {
  const {
    loja,
    atualizarLoja,
    setExibirFormularioLoja,
    validacaoErro,
    validarFormulario,
    saveLoja,
    clear,
    limparValidacao,
    updateLoja,
  } = useLojaStore();
  const { fetchOrganizador } = useOrganizadorStore();
  const { claims } = useAuthStore();
  const organizadorId = claims?.nameid ? Number(claims.nameid) : undefined;
  const [buscandoCep, setBuscandoCep] = useState(false);
  const [erroCep, setErroCep] = useState<string | null>(null);
  const [ultimoCepConsultado, setUltimoCepConsultado] = useState("");

  useEffect(() => {
    limparValidacao();
  }, [limparValidacao]);

  const atualizarCampos = (campos: Partial<Loja>) => {
    const atual = useLojaStore.getState().loja ?? {};
    atualizarLoja({ ...atual, ...campos });
  };

  const atualizarCampo = (campo: keyof Loja, valor: string) => {
    atualizarCampos({ [campo]: valor } as Partial<Loja>);
  };

  const limparCamposViaCep = () => {
    atualizarCampos({
      logradouro: "",
      bairro: "",
      cidade: "",
      uf: "",
    });
  };

  const handleCepChange = (valor: string) => {
    atualizarCampo("cep", valor);
    setErroCep(null);
    setUltimoCepConsultado("");
    limparCamposViaCep();
  };

  const handleLimparFormulario = () => {
    clear();
    limparValidacao();
    setErroCep(null);
    setUltimoCepConsultado("");
  };

  const handleSairFormulario = () => {
    handleLimparFormulario();
    setExibirFormularioLoja(false);
  };

  const handleCadastrarLoja = async () => {
    if (!validarFormulario()) return;
    if (!organizadorId) {
      alert("ID do organizador não encontrado. Faça login novamente.");
      return;
    }

    const resultado = loja?.id
      ? await updateLoja(loja!)
      : await saveLoja(loja!, organizadorId);

    if (!resultado.success) {
      alert("Erro ao salvar loja. Tente novamente.");
      return;
    }

    await fetchOrganizador(organizadorId);
    handleLimparFormulario();
    setExibirFormularioLoja(false);
  };

  const handleCepBlur = async () => {
    const valorAtual = loja?.cep ?? "";
    const cepLimpo = valorAtual.replace(/\D/g, "");
    if (!cepLimpo) {
      setErroCep(null);
      return;
    }
    if (cepLimpo.length !== 8) {
      setErroCep("CEP deve ter 8 dígitos");
      return;
    }
    if (cepLimpo === ultimoCepConsultado) return;

    setBuscandoCep(true);
    setErroCep(null);
    try {
      const address = await fetchAddressByCep(cepLimpo);
      setUltimoCepConsultado(cepLimpo);
      atualizarCampos({
        logradouro: address.logradouro ?? "",
        bairro: address.bairro ?? "",
        cidade: address.localidade ?? "",
        uf: address.uf ? address.uf.toUpperCase() : "",
      });
    } catch (error: any) {
      setErroCep(error?.message ?? "Não foi possível consultar o CEP");
    } finally {
      setBuscandoCep(false);
    }
  };

  return (
    <div className="rounded-[18px] border border-[var(--color-purple-2)] border-l-[6px] bg-gradient-to-b from-[#0F0F17] to-[#09080F] px-8 py-10 shadow-lg">
      <h3 className="text-2xl font-semibold text-[#D9E8FF]">
        {loja?.id ? "Editar informações" : "Cadastrar nova loja"}
      </h3>

      <form
        className="mt-6 space-y-6"
        onSubmit={(ev) => {
          ev.preventDefault();
          handleCadastrarLoja();
        }}
      >
        <Input
          label="Nome da loja"
          placeholder="Nome fantasia ou razão social"
          value={loja?.nmLoja}
          onChange={(v) => atualizarCampo("nmLoja", v)}
          required
          maxLength={120}
          error={validacaoErro?.nmLoja}
        />

        <hr className="border border-[#1d1a32]" />

        <Input
          label="CEP"
          placeholder="00000-000"
          value={loja?.cep}
          onChange={handleCepChange}
          onBlur={handleCepBlur}
          mask="00000-000"
          required
          error={validacaoErro?.cep || erroCep || undefined}
          helperText={buscandoCep ? "Consultando CEP..." : undefined}
        />

        <div className="grid gap-4 md:grid-cols-2">
          <Input
            label="Cidade"
            placeholder="Informe a cidade"
            value={loja?.cidade}
            required
            error={validacaoErro?.cidade}
            readOnly
            inputClassName="cursor-not-allowed"
          />
          <Input
            label="Estado"
            placeholder="UF"
            value={loja?.uf ? String(loja.uf).toUpperCase() : ""}
            maxLength={2}
            required
            error={validacaoErro?.uf}
            readOnly
            inputClassName="cursor-not-allowed"
          />
        </div>

        <div className="grid gap-4 md:grid-cols-[3fr_1fr]">
          <Input
            label="Endereço ou Logradouro"
            placeholder="Rua, avenida..."
            value={loja?.logradouro}
            required
            error={validacaoErro?.logradouro}
            readOnly
            inputClassName="cursor-not-allowed"
          />
          <Input
            label="Número"
            placeholder="Nº"
            value={loja?.numero}
            onChange={(v) => atualizarCampo("numero", v)}
            required
          />
        </div>

        <Input
          label="Bairro"
          placeholder="Informe o bairro"
          value={loja?.bairro}
          required
          error={validacaoErro?.bairro}
          readOnly
          inputClassName="cursor-not-allowed"
        />

        <div className="flex flex-wrap items-center justify-end gap-4 pt-4">
          <Button
            type="button"
            variant="ghost"
            className="gap-2 text-[#FDC700]"
            onClick={handleLimparFormulario}
          >
            <Eraser className="h-4 w-4" />
            Limpar formulário
          </Button>
          <Button
            type="button"
            variant="ghost"
            className="border border-[#FDC700] !text-[#FDC700] hover:bg-[#FDC700]/10 px-8"
            onClick={handleSairFormulario}
          >
            Voltar
          </Button>
          <Button variant="primary" type="submit">
            {loja?.id ? "Atualizar" : "Cadastrar"}
          </Button>
        </div>
      </form>
    </div>
  );
}
