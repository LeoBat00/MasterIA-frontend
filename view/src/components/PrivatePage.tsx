"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { organizadorAuth } from "../auth/hooks/organizadorAuth";
import { useOrganizadorStore } from "../stores/organizador";
import LoadingScreen from "../components/UI/LoadingScreen";

export function PrivatePage({ children }: { children: React.ReactNode }) {
  const { isAuth, hydrated } = organizadorAuth();
  const organizador = useOrganizadorStore((s) => s.organizador);
  const router = useRouter();

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (mounted && hydrated && !isAuth) {
      router.push("/login");
    }
  }, [mounted, hydrated, isAuth, router]);

  if (!mounted || !hydrated) {
    return <LoadingScreen />;
  }

  if (isAuth && !organizador) {
    return <LoadingScreen />;
  }

  if (!isAuth) {
    return null; // já vai redirecionar
  }

  return <>{children}</>;
}
