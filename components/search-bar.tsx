"use client";
import * as React from "react";
import { Search } from "lucide-react";

interface SearchBarProps {
  onSearch: (term: string) => void;
}

export default function SearchBar({ onSearch }: SearchBarProps) {
  const [q, setQ] = React.useState("");

  React.useEffect(() => {
    onSearch(q);
  }, [q, onSearch]);

  return (
    /**
     * CONTÊINER PAI (A Única Borda)
     * - Ocupa a função visual completa.
     * - focus-within: Ativa o estilo quando o input interno é clicado.
     */
    <div className="flex w-full max-w-2xl items-center bg-white h-11 px-4 
                    rounded-full border border-slate-200 transition-all duration-200
                    focus-within:border-blue-600 focus-within:ring-4 focus-within:ring-blue-50/50 
                    shadow-sm group">
      
      {/* Lupa integrada: Sem div de separação para evitar "estranheza" visual */}
      <Search className="h-5 w-5 text-slate-400 group-focus-within:text-blue-600 transition-colors stroke-[2.5px] shrink-0" />

      {/* INPUT NATIVO:
          - Usamos a tag nativa <input /> para evitar estilos ocultos do Shadcn.
          - outline-none e border-none: Garantem que NENHUMA borda interna apareça.
          - ring-0: Remove qualquer sombra de foco automática.
      */}
      <input
        type="text"
        className="flex-1 bg-transparent h-full ml-3 text-sm font-bold text-slate-700 
                   placeholder:text-slate-300 placeholder:font-medium
                   outline-none border-none ring-0 focus:ring-0 focus:outline-none"
        placeholder="O que você precisa hoje?"
        value={q}
        onChange={(e) => setQ(e.target.value)}
      />
    </div>
  );
}