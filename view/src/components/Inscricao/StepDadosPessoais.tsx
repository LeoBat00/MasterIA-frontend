"use client";
import { usePerfilUsuarioStore } from "@/stores/perfilUsuarioStore";
import Input from "@/components/UI/Input";
import Select from "@/components/UI/Select";
import { FaUser, FaEnvelope, FaPhone } from "react-icons/fa";
import {
  validateEmail,
  validateTelefone,
  formatNumber,
} from "@/utils/formatar";
import Button from "@/components/UI/Button";

type Props = { next: () => void };

export default function StepDadosPessoais({ next }: Props) {
  const { perfil, setPerfil } = usePerfilUsuarioStore();
  const nomeValido = Boolean(perfil.nome?.trim());
  const generoValido = Boolean(perfil.genero);
  const emailValido = validateEmail(perfil.email);
  const telefoneValido = validateTelefone(perfil.telefone);
  const canProceed =
    nomeValido && generoValido && emailValido && telefoneValido;

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
        allowTyping={false}
        value={perfil.genero}
        onChange={(v) => {
          if (typeof v === "string") setPerfil({ genero: v });
        }}
        options={[
          { label: "Selecione", value: "" },
          { label: "Masculino", value: "M" },
          { label: "Feminino", value: "F" },
          { label: "Outro", value: "O" },
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
        onChange={(v) => {
          const formatted = formatNumber(v).slice(0, 15);
          setPerfil({ telefone: formatted });
        }}
      />

      <div className="flex justify-end gap-2 w-full mt-4">
        <Button onClick={next} disabled={!canProceed}>
          Avançar
        </Button>
      </div>
    </div>
  );
}
