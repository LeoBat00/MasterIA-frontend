"use client";
import { usePerfilUsuarioStore } from "@/stores/perfilUsuarioStore";
import Select from "@/components/UI/Select";
import Input from "@/components/UI/Input";
import { FiStar, FiUsers, FiClock, FiCalendar } from "react-icons/fi";
import Button from "@/components/UI/Button";

type Props = { next: () => void; prev: () => void };

export default function StepPreferencias({ next, prev }: Props) {
  const { perfil, setPerfil } = usePerfilUsuarioStore();

  const validar = () => {
    if (!perfil.experience || !perfil.qntPessoas || !perfil.tempoJogo)
      return false;
    const idadeNum = parseInt(perfil.idade || "0", 10);
    return idadeNum > 0;
  };

  const canProceed = validar();

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col ">
        <label className="flex items-center gap-2 text-[#D9E8FF] text-[14px]">
          <FiStar /> Nivel de experiencia
        </label>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((level) => (
            <button
              key={level}
              onClick={() => setPerfil({ experience: level })}
              className={`text-2xl transition ${
                perfil.experience >= level ? "text-yellow-400" : "text-gray-500"
              }`}
              aria-label={`Nivel ${level}`}
            >
              {"\u2605"}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label className="flex items-center gap-2 text-[#D9E8FF] text-[14px]">
          <FiUsers /> Quantidade de jogadores
        </label>
        <Select
          animateOptions={true}
          value={perfil.qntPessoas}
          onChange={(v) =>
            typeof v === "string" && setPerfil({ qntPessoas: v })
          }
          options={[
            { label: "Selecione", value: "" },
            { label: "2", value: "2" },
            { label: "3", value: "3" },
            { label: "4", value: "4" },
            { label: "5", value: "5" },
            { label: "6+", value: "6+" },
          ]}
          placeholder="Selecione"
          allowTyping={false}
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="flex items-center gap-2 text-[#D9E8FF] text-[14px]">
          <FiClock /> Tempo medio de jogo
        </label>
        <Select
          value={perfil.tempoJogo}
          animateOptions={true}
          onChange={(v) => typeof v === "string" && setPerfil({ tempoJogo: v })}
          options={[
            { label: "Selecione", value: "" },
            { label: "Jogos rapidos (10–20 min)", value: "1" },
            { label: "Jogos medios (30–40 min)", value: "2" },
            { label: "Jogos longos (50–60 min)", value: "3" },
            { label: "Jogos muito longos (60+ min)", value: "4" },
          ]}
          placeholder="Selecione"
          allowTyping={false}
        />
      </div>

      <Input
        label="Idade"
        containerClassName="!text-[#D9E8FF]"
        value={perfil.idade}
        onChange={(value) => setPerfil({ idade: value })}
        placeholder="Digite sua idade"
        number
        leftIcon={<FiCalendar />}
      />

      <div className="flex justify-between w-full mt-4">
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
