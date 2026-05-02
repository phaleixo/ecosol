"use client";

import { useEffect } from "react";

export default function RegisterSW() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      window.addEventListener("load", async () => {
        try {
          const reg = await navigator.serviceWorker.register("/sw.js");
          console.log("SW registrado:", reg.scope);

          // Tenta atualizar imediatamente o registro e, se houver um worker 'waiting', pede para pular para activated
          try {
            await reg.update();
          } catch (e) {
            console.warn("Erro ao tentar atualizar o SW:", e);
          }

          if (reg.waiting) {
            reg.waiting.postMessage({ type: "SKIP_WAITING" });
          }

          // Também verifica todas as registrations ativas (caso haja outras) e solicita SKIP_WAITING
          try {
            const regs = await navigator.serviceWorker.getRegistrations();
            regs.forEach((r) => {
              if (r.waiting) {
                r.waiting.postMessage({ type: "SKIP_WAITING" });
              }
            });
          } catch (e) {
            console.warn("Falha ao obter registrations:", e);
          }

          reg.addEventListener("updatefound", () => {
            const newWorker = reg.installing;
            if (!newWorker) return;
            newWorker.addEventListener("statechange", () => {
              if (newWorker.state === "installed") {
                if (navigator.serviceWorker.controller) {
                  newWorker.postMessage({ type: "SKIP_WAITING" });
                } else {
                  console.log("Conteúdo em cache para uso offline.");
                }
              }
            });
          });
        } catch (err) {
          console.error("Falha ao registrar SW:", err);
        }
      });

      let refreshing = false;
      navigator.serviceWorker.addEventListener("controllerchange", () => {
        if (refreshing) return;
        refreshing = true;
        window.location.reload();
      });
    }
  }, []);

  return null;
}
