
import { useState, useEffect } from "react";

export function useAutoDigit(messages: string[], speed = 80, pause = 1200) {
  const [index, setIndex] = useState(0); // mensagem atual
  const [subIndex, setSubIndex] = useState(0); // letra atual
  const [deleting, setDeleting] = useState(false); // estamos apagando?

  useEffect(() => {
    if (!messages.length) return;
    if (index >= messages.length) {
      setIndex(0);
      return;
    }
    const currentMessage = messages[index] ?? "";

    // fim da palavra → parar, depois apagar
    if (!deleting && subIndex === currentMessage.length) {
      const timeout = setTimeout(() => setDeleting(true), pause);
      return () => clearTimeout(timeout);
    }

    // apagou tudo → próxima mensagem
    if (deleting && subIndex === 0) {
      setDeleting(false);
      setIndex(prev => (prev + 1) % messages.length);
      return;
    }

    const timeout = setTimeout(() => {
      setSubIndex(prev => prev + (deleting ? -1 : 1));
    }, speed);

    return () => clearTimeout(timeout);
  }, [subIndex, index, deleting, messages, pause, speed]);

  return messages[index].substring(0, subIndex);
}
