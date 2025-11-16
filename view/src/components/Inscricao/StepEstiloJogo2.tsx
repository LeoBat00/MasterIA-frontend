"use client";

import Button from "@/components/UI/Button";
import QuestionSelector from "@/components/Inscricao/QuestionSelector";
import { usePerfilUsuarioStore } from "@/stores/perfilUsuarioStore";

type StepEstiloJogo2Props = {
  prev: () => void;
  next: () => void;
};

const perguntas = [
  {
    key: "gostaDeCriar" as const,
    titulo: "Gosta de montar, desenhar ou criar algo durante o jogo?",
    options: [
      { label: "Sim", value: "sim" },
      { label: "Não", value: "nao" },
      { label: "Não sei dizer", value: "indefinido" },
    ],
  },
  {
    key: "prefereRitmoJogo" as const,
    titulo: "Prefere jogos rápidos e leves ou longos e estratégicos?",
    options: [
      { label: "Rápidos e leves", value: "rapidos" },
      { label: "Longos e estratégicos", value: "longos" },
      { label: "Não sei dizer", value: "indefinido" },
    ],
  },
  {
    key: "gostaDeDesafiosFisicos" as const,
    titulo:
      "Você gosta de jogos que envolvem se mexer, fazer mímicas ou desafios físicos?",
    options: [
      { label: "Sim", value: "sim" },
      { label: "Não", value: "nao" },
      { label: "Não sei dizer", value: "indefinido" },
    ],
  },
];

export default function StepEstiloJogo2({ prev, next }: StepEstiloJogo2Props) {
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
