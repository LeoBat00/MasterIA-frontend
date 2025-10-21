// app/organizadorHome/loja/[id]/LojaGuard.tsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { usePaginaLojaStore } from '@/stores/paginaLoja';
import LoadingOverlay from '@/components/UI/LoadingOverlay';

export default function LojaGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
    const { lojaSelecionada } = usePaginaLojaStore();

  useEffect(() => {

    if (!lojaSelecionada) {
      router.replace('/organizadorHome');
    }
  }, [lojaSelecionada, router]);

  if (!lojaSelecionada) {
    return <LoadingOverlay/>; // ou componente de loading
  }

  return <>{children}</>;
}
