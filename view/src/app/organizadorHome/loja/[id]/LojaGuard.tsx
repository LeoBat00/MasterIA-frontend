// app/organizadorHome/loja/[id]/LojaGuard.tsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { usePaginaLojaStore } from '@/stores/paginaLoja';
import LoadingScreen from '@/components/UI/LoadingScreen';

export default function LojaGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
    const { lojaSelecionada } = usePaginaLojaStore();

  useEffect(() => {

    if (!lojaSelecionada) {
      router.replace('/organizadorHome');
    }
  }, [lojaSelecionada, router]);

  if (!lojaSelecionada) {
    return <LoadingScreen/>; // ou componente de loading
  }

  return <>{children}</>;
}
