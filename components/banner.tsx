"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { X, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Banner() {
  const [isVisible, setIsVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 500);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsClosing(true);
    
    setTimeout(() => {
      setIsVisible(false);
      setIsClosing(false);
    }, 200);
  };

  const handleBannerClick = () => {
    window.open("https://associacaoproautistas.com.br", "_blank", "noopener,noreferrer");
  };

  if (!isVisible) return null;

  return (
    <div
      className={cn(
        "relative w-full bg-gradient-to-r from-[#8B48D3] via-[#9A5AE6] to-[#A15FE2]",
        "border-b border-[#8B48D3]/30 cursor-pointer group overflow-hidden",
        "transition-all duration-300 ease-in-out hover:brightness-110",
        isClosing ? "opacity-0 -translate-y-full h-0" : "opacity-100 translate-y-0 h-auto"
      )}
      onClick={handleBannerClick}
      role="button"
      tabIndex={0}
      aria-label="Visite o site da ASPAS"
    >
      {/* GRID PADRÃO CENTRALIZADO - REMOVIDO py-1 E DEFINIDO h-11 (44px) */}
      <div className="max-w-6xl mx-auto px-6 relative flex items-center justify-center h-11">
        
        {/* WRAPPER DE CONTEÚDO */}
        <div className="flex items-center gap-3 min-w-0 pr-8 sm:pr-0">
          
          {/* LOGO OCUPANDO ALTURA TOTAL (h-11) */}
          <div className="relative w-28 h-11 mt-1 flex-shrink-0">
            <Image
              src="https://associacaoproautistas.com.br/wp-content/uploads/2023/03/logo-branca.png"
              alt="ASPAS"
              fill
              className="object-contain"
              unoptimized
              priority
            />
          </div>
          
          <div className="h-5 w-px bg-white/20 hidden xs:block" />

          {/* TEXTO E CTA (DESKTOP) */}
          <div className="hidden sm:flex items-center gap-3 min-w-0">
            <span className="text-xs font-bold text-white truncate">
              Conheça a ASPAS, associação que apoia pessoas autistas.
            </span>
            <span className="text-[10px] font-black uppercase tracking-widest text-white/90 bg-white/10 px-3 py-0.5 rounded-full border border-white/10 group-hover:bg-white/20 transition-all flex items-center gap-1.5">
              Acessar
              <ExternalLink className="h-3 w-3" />
            </span>
          </div>
          
          {/* TEXTO E CTA (MOBILE) */}
          <div className="sm:hidden flex items-center gap-2 min-w-0">
            <span className="text-xs font-bold text-white truncate">
              Conheça a ASPAS.
            </span>
            <span className="text-[10px] font-black uppercase tracking-widest text-white/90 bg-white/10 px-2.5 py-0.5 rounded-full border border-white/10 flex items-center gap-1">
              Link
              <ExternalLink className="h-2.5 w-2.5" />
            </span>
          </div>
        </div>

        {/* BOTÃO FECHAR */}
        <button
          onClick={handleClose}
          className="absolute right-6 p-1 hover:bg-white/20 rounded-lg transition-colors"
          aria-label="Fechar banner"
        >
          <X className="h-5 w-5 text-white" />
        </button>
      </div>
    </div>
  );
}