'use client';

import MenuLateral from "@/components/MenuLateral";
import { useAuthStore } from "@/stores/auth";
import { useEffect } from "react";

export default function organizadorHomeLayout({ children }: { children: React.ReactNode }) {

    const { initializeAuth } = useAuthStore();

    useEffect(() => {
        initializeAuth();
    }, [initializeAuth]);

    return (
        <div className="flex min-h-screen p-6">
            <MenuLateral />
            <main className="flex-1 pl-12">{children}</main>
        </div>
    );
}