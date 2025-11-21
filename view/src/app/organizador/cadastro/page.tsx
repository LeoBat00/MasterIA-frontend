"use client";

import { useAuthStore } from "@/stores/auth";
import { useOrganizadorStore } from "@/stores/organizador";
import { useEffect } from "react";

export default function CadastroOrganizadorPage() {
  const { claims } = useAuthStore();
  const { organizador, fetchOrganizador, loading } = useOrganizadorStore();
  const organizadorId = claims?.nameid ? Number(claims.nameid) : undefined;

  const formatName = (value?: string) => {
    if (!value) return value;
    return value.charAt(0).toUpperCase() + value.slice(1);
  };

  useEffect(() => {
    if (organizadorId && organizador?.id !== organizadorId) {
      fetchOrganizador(organizadorId).catch((error) =>
        console.error("Erro ao carregar organizador:", error)
      );
    }
  }, [organizadorId, organizador?.id, fetchOrganizador]);

  const info = [
    {
      label: "Nome / Razão social",
      value: formatName(organizador?.razaoSocial),
    },
    { label: "E-mail", value: organizador?.email },
    { label: "Telefone", value: organizador?.telefone || "Não informado" },
  ];

  return (
    <div className="relative mx-auto flex gap-6 px-4 py-6 lg:px-8 flex-col">
      <header>
        <h1>
          <span className="text-zinc-200 font-light text-[38px]">
            Meu Cadastro
          </span>
        </h1>

        <p className="text-[14px] text-zinc-400 max-w-2xl">
          Consulte os dados principais utilizados para autenticação e contato
          dentro da plataforma.
        </p>
        <div className="mt-2 border-b border-zinc-600" />
      </header>

      {!organizadorId ? (
        <div className="rounded-lg border border-yellow-500/30 bg-yellow-500/10 px-4 py-6 text-center text-sm text-yellow-100">
          Faça login para visualizar suas informações de organizador.
        </div>
      ) : loading ? (
        <div className="flex min-h-[140px] items-center justify-center">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#685BFF]/30 border-t-[#685BFF]" />
        </div>
      ) : organizador ? (
        <div className="space-y-6">
          <div>
            <p className="text-sm uppercase tracking-wide text-white/60">
              Informações básicas
            </p>
            <h2 className="text-2xl font-semibold text-[#D9E8FF]">
              {formatName(organizador.razaoSocial) || "Organizador"}
            </h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {info.map((item) => (
              <div
                key={item.label}
                className="rounded-[12px] border border-white/10 bg-white/5 px-4 py-3"
              >
                <p className="text-xs uppercase tracking-wide text-white/60">
                  {item.label}
                </p>
                <p className="text-base font-medium text-[#D9E8FF] mt-1">
                  {item.value || "--"}
                </p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-6 text-center text-sm text-red-200">
          Não foi possível carregar as informações do organizador.
        </div>
      )}
    </div>
  );
}
