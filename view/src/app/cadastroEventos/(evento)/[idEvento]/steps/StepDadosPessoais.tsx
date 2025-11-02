'use client';
import Input from '@/components/UI/Input';
import { FaUser, FaEnvelope, FaPhone } from 'react-icons/fa';

export default function StepDadosPessoais({ onNext }: { onNext: () => void }) {
  return (
    <div className="flex flex-col gap-4 w-full text-[#D9E8FF]">
      <Input
        label="Nome Completo"
        rightIcon={<FaUser />}
        onChange={(v) => console.log(v)}
        value=""
      />
      <Input
        label="Email"
        rightIcon={<FaEnvelope />}
        onChange={(v) => console.log(v)}
        value=""
      />
      <Input
        label="Telefone"
        rightIcon={<FaPhone />}
        onChange={(v) => console.log(v)}
        value=""
      />

      <button
        onClick={onNext}
        className="mt-4 bg-[#616EFF] text-white px-4 py-2 rounded-lg hover:opacity-90 transition"
      >
        Avançar
      </button>
    </div>
  );
}
