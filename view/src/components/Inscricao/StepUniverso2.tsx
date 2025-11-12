"use client";

import Button from "@/components/UI/Button";
import QuestionSelector from "@/components/Inscricao/QuestionSelector";
import { usePerfilUsuarioStore } from "@/stores/perfilUsuarioStore";

type StepUniverso2Props = {
  prev: () => void;
  next: () => void;
};

const perguntas = [
  {
    key: "prefereJogosEngracados" as const,
    titulo: "Prefere jogos engraçados e descontraídos?",
  },
  {
    key: "gostaDeBatalhas" as const,
    titulo:
      "Você gosta de jogos com batalhas, duelos ou confrontos diretos entre jogadores?",
  },
];

const opcoesPadrao = [
  { label: "Sim", value: "sim" },
  { label: "Não", value: "nao" },
  { label: "Não sei dizer", value: "indefinido" },
];

export default function StepUniverso2({ prev, next }: StepUniverso2Props) {
  const { perfil, setPerfil } = usePerfilUsuarioStore();

  const handleSelect = (
    field: (typeof perguntas)[number]["key"],
    value: string
  ) => {
    setPerfil({ [field]: value } as Partial<typeof perfil>);
  };

  const handleNext = () => {
    if (perguntas.some(({ key }) => !perfil[key])) {
      alert("Selecione uma opção para cada pergunta.");
      return;
    }
    next();
  };

  return (
    <div className="flex w-full flex-col gap-[16px] text-[#D9E8FF]">
      <div>
        <h2 className="text-xl font-semibold">Seu tipo de universo</h2>
      </div>

      <div className="flex flex-col gap-[8px]">
        {perguntas.map(({ key, titulo }) => (
          <QuestionSelector
            key={key}
            title={titulo}
            options={opcoesPadrao}
            value={perfil[key] as string}
            onChange={(value) => handleSelect(key, value)}
          />
        ))}
      </div>

      <div className="mt-4 flex w-full justify-between">
        <Button variant="outlineGhostPurple" onClick={prev}>
          Voltar
        </Button>
        <Button onClick={handleNext}>Avançar</Button>
      </div>
    </div>
  );
}
