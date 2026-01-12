"use client";
import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";

const CATEGORIES = [
  "All Services",
  "Construction",
  "Beauty",
  "Tech",
  "Legal",
  "Marketing",
  "Wellness",
];

export default function CategoryFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Pega a categoria ativa da URL ou define como padrão "All Services"
  const active = searchParams.get("cat") || "All Services";

  function handleFilter(category: string) {
    const params = new URLSearchParams(searchParams);
    
    if (category === "All Services") {
      params.delete("cat"); // Remove o filtro se escolher 'Todos'
    } else {
      params.set("cat", category); // Adiciona a categoria na URL
    }

    // Navegação suave do Next.js sem recarregar a página
    router.push(`/?${params.toString()}`);
  }

  return (
    <div className="flex gap-2 overflow-x-auto py-1 no-scrollbar">
      {CATEGORIES.map((c) => (
        <button
          key={c}
          onClick={() => handleFilter(c)}
          className={
            "whitespace-nowrap rounded-full px-4 py-1 text-sm transition-colors " +
            (active === c
              ? "bg-blue-600 text-white shadow-md"
              : "bg-slate-100 text-slate-700 hover:bg-slate-200")
          }
        >
          {c}
        </button>
      ))}
    </div>
  );
}