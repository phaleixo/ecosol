"use client";
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// Função utilitária para combinar classes do Tailwind sem conflitos
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// 1. DEFINIÇÃO DAS VARIANTES (O coração do Shadcn/UI)
const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none",
  {
    variants: {
      variant: {
        default: "bg-blue-600 text-white hover:bg-blue-700 shadow-sm",
        destructive: "bg-red-600 text-white hover:bg-red-700 shadow-sm",
        outline: "border border-slate-200 bg-white hover:bg-slate-100 text-slate-900",
        secondary: "bg-slate-100 text-slate-900 hover:bg-slate-200",
        ghost: "hover:bg-slate-100 text-slate-600 hover:text-slate-900", // Agora seu erro some!
        link: "text-blue-600 underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

// 2. INTERFACE TIPADA (Engenharia de Tipos)
export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

// 3. COMPONENTE FINAL
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";

export { Button, buttonVariants };