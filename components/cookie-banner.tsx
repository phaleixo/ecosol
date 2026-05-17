"use client";

import React, { JSX, useState, useEffect } from "react";

const STORAGE_KEY = "ecosol_cookie_consent";
const STORAGE_VALUE_ACCEPTED = "accepted";
const STORAGE_VALUE_REJECTED = "rejected";

// ========== Funções auxiliares (isoladas e seguras) ==========
function readCookieValue(name: string): string | null {
  try {
    if (typeof window === "undefined") return null;
    const prefix = `${name}=`;
    const cookies = document.cookie.split("; ");
    const match = cookies.find((cookie) => cookie.startsWith(prefix));
    return match ? decodeURIComponent(match.slice(prefix.length)) : null;
  } catch {
    return null;
  }
}

function readStoredConsent(): "accepted" | "rejected" | null {
  try {
    if (typeof window === "undefined") return null;

    // Tenta localStorage primeiro
    const localValue = window.localStorage.getItem(STORAGE_KEY);
    if (
      localValue === STORAGE_VALUE_ACCEPTED ||
      localValue === STORAGE_VALUE_REJECTED
    ) {
      return localValue;
    }

    // Tenta cookie como fallback
    const cookieValue = readCookieValue(STORAGE_KEY);
    if (
      cookieValue === STORAGE_VALUE_ACCEPTED ||
      cookieValue === STORAGE_VALUE_REJECTED
    ) {
      return cookieValue;
    }

    return null;
  } catch {
    return null;
  }
}

function setConsentCookie(value: "accepted" | "rejected"): void {
  const maxAge = 60 * 60 * 24 * 365; // 1 ano
  document.cookie = `${STORAGE_KEY}=${encodeURIComponent(value)}; Path=/; Max-Age=${maxAge}; SameSite=Lax; Secure`;
}

function persistConsent(value: "accepted" | "rejected"): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, value);
  } catch {
    // Falha silenciosa em ambientes sem localStorage (ex.: incógnito)
  }

  try {
    setConsentCookie(value);
  } catch {
    // Falha silenciosa
  }
}

// ========== Componente principal ==========
export default function CookieBanner(): JSX.Element | null {
  // Inicialmente NÃO exibe o banner (evita flash no SSR e hidratação)
  const [isVisible, setIsVisible] = useState<boolean>(false);

  // Após montar no cliente, verifica se já existe consentimento
  useEffect(() => {
    const consent = readStoredConsent();
    // Se NÃO houver consentimento salvo, mostra o banner
    if (consent === null) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsVisible(true);
    }
    // Se já houver "accepted" ou "rejected", mantém isVisible = false (banner oculto)
  }, []); // Executa apenas uma vez

  const accept = () => {
    setIsVisible(false);
    persistConsent(STORAGE_VALUE_ACCEPTED);
  };

  const reject = () => {
    setIsVisible(false);
    persistConsent(STORAGE_VALUE_REJECTED);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-x-4 bottom-4 z-50 md:inset-x-6 md:bottom-6">
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-3 rounded-lg border border-gray-200 bg-white/95 p-4 shadow-lg dark:border-gray-800 dark:bg-slate-900/95 md:flex-row">
        <div className="flex-1 text-sm text-slate-800 dark:text-slate-200">
          Usamos cookies para melhorar sua experiência. Você aceita?
        </div>
        <div className="flex flex-shrink-0 gap-2">
          <button
            type="button"
            onClick={reject}
            className="cursor-pointer rounded-md border border-gray-300 px-3 py-1.5 text-sm text-slate-700 transition-all hover:bg-gray-50 active:scale-[0.98] dark:border-gray-700 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            Recusar
          </button>
          <button
            type="button"
            onClick={accept}
            className="cursor-pointer rounded-md bg-emerald-600 px-3 py-1.5 text-sm text-white transition-all hover:bg-emerald-500 active:scale-[0.98]"
          >
            Aceitar
          </button>
        </div>
      </div>
    </div>
  );
}