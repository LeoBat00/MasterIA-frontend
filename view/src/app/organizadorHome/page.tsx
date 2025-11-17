"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FaTrash, FaPen } from "react-icons/fa";
import { ChevronRight, Plus, Search, X as CloseIcon } from "lucide-react";
import { useOrganizadorStore } from "../../stores/organizador";
import FormularioNovaLoja from "./formularioNovaLoja";
import { useLojaStore } from "@/stores/loja";
import { obterEnderecoCompleto } from "../util";
import { useAuthStore } from "@/stores/auth";
import { Loja } from "@/types/loja";
import { usePaginaLojaStore } from "@/stores/paginaLoja";

export default function OrganizadorHome() {
  const router = useRouter();
  const [lojas, setLojas] = useState<Loja[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const { claims, logout } = useAuthStore();
  const { setLoja } = usePaginaLojaStore();

  const { exibirFormularioLoja, setExibirFormularioLoja, atualizarLoja } =
    useLojaStore();
  const { organizador, fetchOrganizador } = useOrganizadorStore();

  function handleCadastrarLoja() {
    setExibirFormularioLoja(!exibirFormularioLoja);
  }

  const buscarOrganizador = useCallback(
    async (organizadorId: number) => {
      await fetchOrganizador(organizadorId).catch(() => {
        logout();
        router.push("/login");
      });
    },
    [fetchOrganizador, logout, router]
  );

  useEffect(() => {
    setLoja({} as Loja);
  }, [setLoja]);

  useEffect(() => {
    const run = async () => {
      const organizadorId = claims?.nameid ? Number(claims.nameid) : undefined;
      if (organizadorId && !organizador) {
        await buscarOrganizador(organizadorId);
      }
    };

    run();
  }, [claims, organizador, buscarOrganizador]);

  useEffect(() => {
    setLojas(organizador?.lojas || []);
  }, [organizador]);

  const handleEditarLoja = (loja: Loja) => {
    atualizarLoja(loja);
    setExibirFormularioLoja(true);
  };

  const handleAcessarLoja = (loja: Loja) => {
    router.push(`organizadorHome/loja/${loja.id}`);
  };

  const normalizedSearch = searchTerm.trim().toLowerCase();
  const lojasFiltradas = lojas.filter((loja) =>
    loja.nmLoja?.toLowerCase().includes(normalizedSearch)
  );

  return (
    <div className="relative min-h-screen w-full overflow-hidden text-white">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom_left,_#0E0E15_0%,_#14141F_100%)]" />
      <div
        className="pointer-events-none absolute inset-0 opacity-5"
        style={{
          backgroundImage: "url('/bgCadastroLoja.png')",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
        }}
      />
      <div className="relative mx-auto flex gap-6 px-4 py-6 lg:px-8">
        <main className="flex-1">
          <div className="mb-4">
            <h1>
              <span className="text-zinc-200 font-light text-[38px]">
                Bem vindo ao{" "}
              </span>{" "}
              <span className="bg-gradient-to-r font-semibold text-[38px] from-[#685BFF] via-[#951FFB] to-[#7C3AED] bg-clip-text text-transparent">
                MasterIA!
              </span>
            </h1>
            <p className="text-[14px] text-zinc-400">Gerencie suas lojas</p>
            <div className="mt-2 border-b border-zinc-600" />
          </div>
          <section aria-labelledby="lojas-cadastradas">
            <div className="mb-6 flex items-center gap-3">
              <h2
                id="lojas-cadastradas"
                className="text-lg font-normal text-zinc-200"
              >
                Lojas cadastradas
              </h2>

              {!exibirFormularioLoja && (
                <button
                  onClick={handleCadastrarLoja}
                  className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-gradient-to-r from-[#951FFB] to-[#685BFF] px-10 py-1.5 text-sm font-medium text-white shadow hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-purple-500/60"
                >
                  <span>Cadastrar loja</span>
                  <Plus className="h-4 w-4" />
                </button>
              )}
            </div>

            <div className="mb-6 max-w-xl">
              <div className="relative">
                <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-white/60">
                  <Search className="h-4 w-4" />
                </span>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Buscar por nome"
                  className="h-11 w-full rounded-[8px] border border-[#6F4BFF]/50 bg-[#151129] pl-10 pr-10 text-white placeholder:text-white/60 focus:border-[#7C3FFD] focus:outline-none focus:ring-1 focus:ring-[#7C3FFD]"
                />
                {searchTerm && (
                  <button
                    type="button"
                    onClick={() => setSearchTerm("")}
                    aria-label="Limpar busca"
                    className="absolute cursor-pointer inset-y-0 right-3 flex items-center text-white/70 hover:text-white"
                  >
                    <CloseIcon className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>

            <div className="group space-y-2">
              {exibirFormularioLoja ? (
                <div>
                  <FormularioNovaLoja />
                </div>
              ) : (
                lojasFiltradas.map((l) => (
                  <article
                    onClick={() => handleAcessarLoja(l)}
                    onKeyDown={(ev) => {
                      if (ev.key === "Enter" || ev.key === " ") {
                        ev.preventDefault();
                        handleAcessarLoja(l);
                      }
                    }}
                    tabIndex={0}
                    role="button"
                    key={l.id}
                    className="rounded-[8px] bg-[#08080C] p-4 shadow-[0_0_0_1px_rgba(255,255,255,0.02)] hover:cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#685BFF] border-l-[6px] border-b border-[var(--color-purple-2)] hover:border-[var(--color-purple-1)] transition duration-200 group-hover:opacity-80 hover:!opacity-100"
                  >
                    <div className="flex items-center justify-between">
                      <div className="">
                        <div className="text-[20px] font-medium mb-1">
                          {l.nmLoja}
                        </div>
                        <div className="text-[14px] font-regular text-[var(--text-color-info)]">
                          <div className="flex items-center gap-2">
                            <span className="mr-1 ">Endereço</span>
                            <span>{obterEnderecoCompleto(l)}</span>
                          </div>
                        </div>
                        <div className="mt-4 flex items-center text-sm font-regular border-2 border-[#72D999]/10 w-fit rounded-[8px] px-2 py-0.5 text-[#72D999] bg-[#72D999]/10">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold">Status</span>
                            <span className="font-light">Ativo</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <button
                          className="rounded-lg cursor-pointer border border-white/10 p-2 text-zinc-300 hover:border-purple-500/40 hover:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/60"
                          aria-label={`Editar a loja ${l.id}`}
                          title="Editar loja"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditarLoja(l);
                          }}
                        >
                          <FaPen className="h-5 w-5" />
                        </button>

                        <button
                          className="rounded-lg cursor-pointer border border-white/10 p-2 text-zinc-300 hover:border-purple-500/40 hover:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/60"
                          aria-label={`Excluir a loja ${l.id}`}
                          title="Excluir loja"
                          onClick={(e) => {
                            e.stopPropagation();
                            console.log("clicou no botão excluir");
                          }}
                        >
                          <FaTrash className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  </article>
                ))
              )}

              {!exibirFormularioLoja && (
                <button
                  onClick={handleCadastrarLoja}
                  className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-[8px] border border-purple-500/30 bg-purple-700/10 p-8 text-purple-200 hover:border-purple-500/60 hover:bg-purple-700/15 focus:outline-none focus:ring-2 focus:ring-purple-500/60"
                  aria-label="Adicionar nova loja"
                >
                  <Plus className="h-5 w-5" />
                  Adicionar nova loja
                </button>
              )}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
