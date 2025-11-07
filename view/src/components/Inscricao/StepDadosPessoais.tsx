"use client";
import { usePerfilUsuarioStore } from "@/stores/perfilUsuarioStore";
import Input from "@/components/UI/Input";
import Select from "@/components/UI/Select";
import { FaUser, FaEnvelope, FaPhone } from "react-icons/fa";
import { validateEmail, validateTelefone, formatNumber } from "@/utils/formatar";
import Button from "@/components/UI/Button";

type Props = { next: () => void };

export default function StepDadosPessoais({ next }: Props) {
  const { perfil, setPerfil } = usePerfilUsuarioStore();

  const handleNext = () => {
    if (!perfil.nome?.trim() || !perfil.genero) return alert("Preencha nome e genero.");
    if (!validateEmail(perfil.email)) return alert("Informe um e-mail valido.");
    if (!validateTelefone(perfil.telefone)) return alert("Informe um telefone valido.");
    next();
  };

  return (
    <div className="flex flex-col gap-4">
      <Input
        label="Nome completo"
        containerClassName="!text-[#D9E8FF]"
        rightIcon={<FaUser />}
        value={perfil.nome}
        onChange={(v) => setPerfil({ nome: v })}
      />

      <Select
        label="Genero"
        value={perfil.genero}
        onChange={(v) => { if (typeof v === 'string') setPerfil({ genero: v }); }}
        options={[
          { label: 'Selecione', value: '' },
          { label: 'Masculino', value: 'M' },
          { label: 'Feminino', value: 'F' },
          { label: 'Outro', value: 'O' },
        ]}
        placeholder="Selecione"
      />

      <Input
        label="Email"
        containerClassName="!text-[#D9E8FF]"
        rightIcon={<FaEnvelope />}
        value={perfil.email}
        onChange={(v) => setPerfil({ email: v })}
      />

      <Input
        label="Telefone"
        containerClassName="!text-[#D9E8FF]"
        rightIcon={<FaPhone />}
        value={perfil.telefone}
        onChange={(v) => setPerfil({ telefone: formatNumber(v) })}
      />

      <div className="flex justify-end gap-2 w-full mt-4">
        <Button onClick={handleNext}>Avancar</Button>
      </div>
    </div>
  );
}
