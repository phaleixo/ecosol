"use client";
import * as React from "react";

// Definimos quais variantes o nosso botão aceita
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "destructive";
}

export function Button({
  children,
  className = "",
  variant = "default", // Valor padrão caso não seja enviado nada
  ...props
}: ButtonProps) {
  
  // Mapeamento de estilos por variante
  const variants = {
    default: "bg-blue-600 text-white hover:bg-blue-700",
    outline: "border border-slate-300 bg-transparent text-slate-700 hover:bg-slate-100",
    destructive: "bg-red-600 text-white hover:bg-red-700",
  };

  const variantStyle = variants[variant];

  return (
    <button
      {...props}
      className={
        `inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors disabled:opacity-50 ${variantStyle} ${className}`
      }
    >
      {children}
    </button>
  );
}