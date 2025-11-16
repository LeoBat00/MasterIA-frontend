import { create } from "zustand";
import { devtools } from "zustand/middleware";
import type { EventoAtivo } from "@/types/evento";
import { getEventosAtivos } from "@/api/evento";

type EventosAtivosState = {
  eventos: EventoAtivo[];
  loading: boolean;
  error?: string;
  fetch: () => Promise<void>;
  setEventos: (eventos: EventoAtivo[]) => void;
};

export const useEventosAtivosStore = create<EventosAtivosState>()(
  devtools(
    (set) => ({
      eventos: [],
      loading: false,
      error: undefined,
      setEventos: (eventos) => set({ eventos }, false, "setEventos"),
      fetch: async () => {
        try {
          set({ loading: true, error: undefined }, false, "fetch:start");
          const data = await getEventosAtivos();
          set({ eventos: data ?? [] }, false, "fetch:success");
        } catch (error) {
          console.error("Erro ao carregar eventos ativos", error);
          set({ error: "Erro ao carregar eventos ativos" }, false, "fetch:error");
        } finally {
          set({ loading: false }, false, "fetch:finally");
        }
      },
    }),
    { name: "EventosAtivosStore" }
  )
);

