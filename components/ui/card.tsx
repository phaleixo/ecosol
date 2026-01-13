"use client";
import * as React from "react";

export function Card({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`
      /* Estrutura Sólida e Arredondada */
      bg-white border border-slate-100 rounded-[2rem] p-5
      
      /* Sombras e Transições de Engenharia */
      shadow-sm hover:shadow-xl hover:shadow-blue-500/5 
      hover:border-blue-100 transition-all duration-300
      ${className}
    `}>
      {children}
    </div>
  );
}