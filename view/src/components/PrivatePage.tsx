// src/components/PrivatePage.tsx
"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { organizadorAuth } from "../auth/hooks/organizadorAuth";
import { useOrganizadorStore } from "../stores/organizador";
import LoadingScreen from "../components/UI/LoadingScreen";

type Props = {
    children: React.ReactNode;
};

export function PrivatePage({ children }: Props) {
    const { isAuth, hydrated } = organizadorAuth();
    const router = useRouter();
    
    useEffect(() => {
        if (hydrated && !isAuth) {
            router.push("/login");
        }
    }, [hydrated, isAuth, router]);

    const organizador = useOrganizadorStore((s) => s.organizador);

    if (!organizador) {
        return <LoadingScreen />;
    }


    return <>{children}</>;
}
