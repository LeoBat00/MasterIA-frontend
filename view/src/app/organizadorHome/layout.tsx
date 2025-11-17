"use client";

import MenuLateral from "@/components/MenuLateral";
import { useAuthStore } from "@/stores/auth";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";

export default function useOrganizadorHomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { initializeAuth } = useAuthStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  return (
    <div className="flex min-h-screen bg-[#040405] text-white">
      <div className="hidden lg:block">
        <MenuLateral />
      </div>

      <main className="flex-1">
        <div className="flex items-center justify-between border-b border-white/10 bg-[#040405] lg:hidden">
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-md border border-white/10 p-2 text-white"
            aria-label="Abrir menu"
            onClick={() => setIsMenuOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </button>
          <span className="text-sm font-medium text-white/70">
            Painel do organizador
          </span>
        </div>

        <div className="">{children}</div>
      </main>

      {isMenuOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div className="h-full w-[18rem] max-w-[85vw]">
            <MenuLateral
              className="h-full w-full rounded-none border-r"
              onNavigate={() => setIsMenuOpen(false)}
            />
          </div>
          <button
            type="button"
            className="flex-1 bg-black/60"
            aria-label="Fechar menu"
            onClick={() => setIsMenuOpen(false)}
          />
          <button
            type="button"
            className="absolute top-4 right-4 rounded-full bg-black/70 p-2 text-white"
            aria-label="Fechar menu"
            onClick={() => setIsMenuOpen(false)}
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      )}
    </div>
  );
}
