// src/stores/message.ts
import { create } from "zustand";
import { devtools } from "zustand/middleware";

export type Message = {
  id: string;
  type: "success" | "error" | "info" | "warning";
  text: string;
};

type MessageState = {
  messages: Message[];
  addMessage: (msg: Omit<Message, "id">) => void;
  removeMessage: (id: string) => void;
  clearMessages: () => void;
};

export const useMessageStore = create<MessageState>()(
  devtools(
    (set, get) => ({
      messages: [],

      addMessage: (msg) => {
        const id = crypto.randomUUID(); // gera um id único
        const newMessage: Message = { id, ...msg };
        set(
          (state) => ({
            messages: [...state.messages, newMessage],
          }),
          false,
          "addMessage"
        );

        // remove automaticamente após 5s
        setTimeout(() => {
          get().removeMessage(id);
        }, 5000);
      },

      removeMessage: (id) =>
        set(
          (state) => ({
            messages: state.messages.filter((m) => m.id !== id),
          }),
          false,
          "removeMessage"
        ),

      clearMessages: () => set({ messages: [] }, false, "clearMessages"),
    }),
    { name: "Message" }
  )
);
