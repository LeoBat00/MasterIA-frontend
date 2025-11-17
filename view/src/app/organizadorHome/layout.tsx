"use client";

import MenuLateral from "@/components/MenuLateral";
import { useAuthStore } from "@/stores/auth";
import { useEffect } from "react";

export default function useOrganizadorHomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { initializeAuth } = useAuthStore();

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  return (
    <div className="flex min-h-screen">
      <MenuLateral />
      <main className="flex-1">{children}</main>
    </div>
  );
}
