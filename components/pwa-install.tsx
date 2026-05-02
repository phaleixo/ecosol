"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform?: string }>;
}

export default function PWAInstall() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [, setVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [installed, setInstalled] = useState(false);
  const [showFallbackInfo, setShowFallbackInfo] = useState(false);

  useEffect(() => {
    function onBeforeInstallPrompt(e: BeforeInstallPromptEvent) {
      e.preventDefault();
      // save the event for later
      setDeferredPrompt(e);
      // only show if on mobile
      const mobile = window.matchMedia("(max-width: 768px)").matches;
      setIsMobile(mobile);
      if (mobile) setVisible(true);
      console.log("beforeinstallprompt captured");
      setShowFallbackInfo(false);
    }

    function onAppInstalled() {
      setDeferredPrompt(null);
      setVisible(false);
      console.log("PWA installed");
      setInstalled(true);
    }

    window.addEventListener(
      "beforeinstallprompt",
      onBeforeInstallPrompt as EventListener
    );
    window.addEventListener("appinstalled", onAppInstalled as EventListener);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        onBeforeInstallPrompt as EventListener
      );
      window.removeEventListener(
        "appinstalled",
        onAppInstalled as EventListener
      );
    };
  }, []);

  async function handleInstallClick() {
    if (deferredPrompt) {
      try {
        await deferredPrompt.prompt();
        const choiceResult = await deferredPrompt.userChoice;
        console.log("userChoice", choiceResult);
        setDeferredPrompt(null);
        setShowFallbackInfo(false);
      } catch (err) {
        console.error("Install prompt failed", err);
      }
    } else {
      // Show lightweight fallback instructions when prompt not available
      setShowFallbackInfo(true);
      setTimeout(() => setShowFallbackInfo(false), 4000);
      console.info(
        "No beforeinstallprompt event - show manual install instructions"
      );
    }
  }

  // Only show on mobile and when not already installed
  if (!isMobile || installed) return null;

  return (
    <div className="fixed right-4 bottom-20 z-50 md:hidden">
      <button
        onClick={handleInstallClick}
        aria-label="Instalar ECOSOL"
        className="flex items-center gap-3 bg-[#fafafa] text-primary border border-primary px-3 py-2 rounded-2xl shadow-sm hover:shadow-md active:scale-95 transition-transform"
      >
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#fafafa] text-primary overflow-hidden">
          <Image
            src="/ecosol-meta.png"
            alt="Ecosol"
            width={20}
            height={20}
            className="object-contain"
          />
        </div>
        <span className="font-black text-sm">Instalar ECOSOL</span>
      </button>
      {showFallbackInfo && (
        <div className="mt-2 w-56 p-2 bg-card border border-border rounded-md text-xs text-muted-foreground shadow-md">
          Toque no menu do navegador e escolha Instalar&quot; ou Adicionar à
          tela inicial&quot;.
        </div>
      )}
    </div>
  );
}
