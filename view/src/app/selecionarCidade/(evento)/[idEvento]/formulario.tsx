'use client';
import { useState } from 'react';
import StepDadosPessoais from './steps/StepDadosPessoais';
import StepInfo1 from './steps/StepInfo1';

export default function CadastroForm() {
  const [passoAtual, setPassoAtual] = useState(1);
  const totalPassos = 2;

  const proximo = () => setPassoAtual((prev) => Math.min(prev + 1, totalPassos));

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-md">
      <div className="rounded-full w-fit px-8 py-1 bg-[var(--background-color-3)]">
        <p className="text-xs text-center bg-[var(--text-color-1)] bg-clip-text text-transparent">
          Passo {passoAtual} de {totalPassos}
        </p>
      </div>

      <div className="w-full h-[1px] bg-zinc-600" />

      {passoAtual === 1 && <StepDadosPessoais onNext={proximo} />}
      {passoAtual === 2 && <StepInfo1 onNext={proximo} />}
      {passoAtual === 3 && <StepInfo1 onNext={proximo} />}
      {passoAtual === 4 && <StepInfo1 onNext={proximo} />}
    </div>
  );
}
