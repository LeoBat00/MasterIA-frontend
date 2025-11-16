"use client";

import Button from "@/components/UI/Button";
import QuestionSelector from "@/components/Inscricao/QuestionSelector";
import { usePerfilUsuarioStore } from "@/stores/perfilUsuarioStore";

type StepEstiloJogoProps = {
  prev: () => void;
  next: () => void;
};

const perguntas = [
  {
    key: "prefereSorteOuEstrategia" as const,
    titulo: "Você prefere jogos que envolvem sorte ou estratégia?",
    options: [
      { label: "Sorte", value: "sorte" },
      { label: "Estratégia", value: "estrategia" },
      { label: "Não sei dizer", value: "indefinido" },
    ],
  },
  {
    key: "prefereCompetirOuCooperar" as const,
    titulo: "Prefere competir diretamente ou trabalhar em equipe?",
    options: [
      { label: "Competir", value: "competir" },
      { label: "Cooperar", value: "cooperar" },
      { label: "Não sei dizer", value: "indefinido" },
    ],
  },
  {
    key: "curteNegociar" as const,
    titulo: "Curte negociar, blefar e interagir com outros jogadores?",
    options: [
      { label: "Sim", value: "sim" },
      { label: "Não", value: "nao" },
      { label: "Não sei dizer", value: "indefinido" },
    ],
  },
];

export default function StepEstiloJogo({ prev, next }: StepEstiloJogoProps) {
  const { perfil, setPerfil } = usePerfilUsuarioStore();

  const handleSelect = (
    field: (typeof perguntas)[number]["key"],
    value: string
  ) => {
    setPerfil({ [field]: value } as Partial<typeof perfil>);
  };

  const canProceed = perguntas.every(({ key }) => Boolean(perfil[key]));

  return (
    <div className="flex w-full flex-col gap-6 text-[#D9E8FF]">
      <div>
        <h2 className="text-xl font-semibold">Como você gosta de jogar?</h2>
      </div>

      <div className="flex flex-col gap-[8px]">
        {perguntas.map(({ key, titulo, options }) => (
          <QuestionSelector
            key={key}
            title={titulo}
            options={options}
            value={perfil[key] as string}
            onChange={(value) => handleSelect(key, value)}
          />
        ))}
      </div>

      <div className="mt-4 flex w-full justify-between">
        <Button variant="outlineGhostPurple" onClick={prev}>
          Voltar
        </Button>
        <Button onClick={next} disabled={!canProceed}>
          Avançar
        </Button>
      </div>
    </div>
  );
}
