'use client';

import { useParams } from 'next/navigation';

export default function CidadePage() {
  const { nome } = useParams();

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#0D0D12] text-white">
      <h1 className="text-2xl font-semibold">
        Página da cidade: {nome}
      </h1>
    </main>
  );
}
