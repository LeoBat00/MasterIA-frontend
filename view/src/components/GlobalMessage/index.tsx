// src/components/GlobalMessage.tsx
"use client";

import { useMessageStore } from "@/stores/useMessageStore";

import { XCircle, CheckCircle, AlertTriangle, Info } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { JSX } from "react";

export default function GlobalMessage() {
  const { messages, removeMessage } = useMessageStore();

  return (
    <div className="fixed top-4 left-1/2 z-50 flex w-full max-w-xl -translate-x-1/2 flex-col gap-3 px-4">
      <AnimatePresence>
        {messages.map((msg) => {
          const styles = {
            success: "bg-green-600 text-white",
            error: "bg-red-600 text-white",
            warning: "bg-yellow-500 text-black",
            info: "bg-blue-600 text-white",
          };

          const icons: Record<typeof msg.type, JSX.Element> = {
            success: <CheckCircle className="h-5 w-5" />,
            error: <XCircle className="h-5 w-5" />,
            warning: <AlertTriangle className="h-5 w-5" />,
            info: <Info className="h-5 w-5" />,
          };

          return (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              className={`flex items-center justify-between gap-3 rounded-lg px-4 py-3 shadow-lg ${styles[msg.type]}`}
            >
              <div className="flex items-center gap-2">
                {icons[msg.type]}
                <span className="text-sm font-medium">{msg.text}</span>
              </div>
              <button
                onClick={() => removeMessage(msg.id)}
                className="text-white/80 hover:text-white"
              >
                <XCircle className="h-4 w-4" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
