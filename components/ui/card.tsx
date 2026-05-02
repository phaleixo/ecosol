// components/ui/card.tsx
"use client";

import * as React from "react";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  clickable?: boolean;
  skeleton?: boolean;
}

export function Card({ 
  children, 
  className, 
  clickable = false,
  skeleton = false,
  ...props 
}: CardProps) {
  return (
    <div 
      className={cn(
        // ESTRUTURA RESPONSIVA
        "flex flex-col h-full w-full",
        "bg-card",
        "border border-border",
        "rounded-sm md:rounded-sm", // Reduzido no mobile
        "p-3 md:p-3.5", // Reduzido no mobile
        "shadow-sm",
        "overflow-hidden",
        "transition-all duration-300",
        
        // Estados
        clickable && !skeleton && "hover:border-primary/40 hover:shadow-md cursor-pointer",
        skeleton && "cursor-default",
        
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

// CONTÊINER DE CONTEÚDO FIXO
export function CardContent({ 
  children, 
  className 
}: { 
  children: React.ReactNode; 
  className?: string;
}) {
  return (
    <div className={cn(
      "h-full w-full flex flex-col",
      className
    )}>
      {children}
    </div>
  );
}

// IMAGEM COM DIMENSÕES E COMPORTAMENTO MELHORADO
export const CardImageContainer = ({ 
  children, 
  className,
  skeleton = false 
}: { 
  children: React.ReactNode; 
  className?: string;
  skeleton?: boolean;
}) => (
  <div className={cn(
    // Dimensões responsivas
    "relative w-full",
    "aspect-[4/3]", // Mantém 4:3
    "rounded-sm md:rounded-sm", // Reduzido no mobile
    "bg-muted",
    "overflow-hidden",
    "border border-border",
    "mb-2 md:mb-3", // Reduzido no mobile
    
    skeleton && "animate-pulse",
    className
  )}>
    {children}
  </div>
);

// TÍTULO E DESCRIÇÃO COM LAYOUT FIXO
export const CardTitleDescription = ({ 
  children, 
  className,
  skeleton = false 
}: { 
  children: React.ReactNode; 
  className?: string;
  skeleton?: boolean;
}) => (
  <div className={cn(
    "flex-1",
    "px-0.5 md:px-1.5", // Reduzido no mobile
    "min-h-[68px] md:min-h-[72px]", // Reduzido no mobile
    "max-h-[68px] md:max-h-[72px]", // Reduzido no mobile
    "overflow-hidden",
    
    skeleton && "space-y-2",
    className
  )}>
    {children}
  </div>
);

// RODAPÉ COM DIMENSÕES FIXAS
export const CardFooter = ({ 
  children, 
  className,
  skeleton = false 
}: { 
  children: React.ReactNode; 
  className?: string;
  skeleton?: boolean;
}) => (
  <div className={cn(
    "mt-2 md:mt-4", // Reduzido no mobile
    "pt-2 md:pt-3", // Reduzido no mobile
    "min-h-[76px] md:min-h-[84px]", // Reduzido no mobile
    "border-t border-border",
    "space-y-2 md:space-y-3", // Reduzido no mobile
    "px-0.5 md:px-1.5", // Reduzido no mobile
    
    !skeleton && "group-hover:border-primary/20 transition-colors duration-300",
    className
  )}>
    {children}
  </div>
);

// CATEGORIA COM DIMENSÕES FIXAS
interface CardCategoryProps {
  children?: React.ReactNode;
  className?: string;
  skeleton?: boolean;
}

export const CardCategory = ({ 
  children, 
  className,
  skeleton = false 
}: CardCategoryProps) => {
  if (skeleton) {
    return (
      <div className={cn(
        "inline-flex items-center",
        "h-[20px] md:h-[24px]", // Reduzido no mobile
        "px-2 py-1 md:px-2.5 md:py-1.5", // Reduzido no mobile
        "bg-primary/10 rounded-sm",
        "animate-pulse"
      )}>
        <div className="h-2.5 md:h-3 w-12 md:w-16 bg-primary/20 rounded" />
      </div>
    );
  }
  
  return (
    <span className={cn(
      "inline-flex items-center",
      "h-[20px] md:h-[24px]", // Altura FIXA igual ao skeleton
      "text-[6px] md:text-[7px] font-black text-primary uppercase tracking-[0.2em]", // Reduzido no mobile
      "px-2 py-1 md:px-2.5 md:py-1.5", // Reduzido no mobile
      "bg-primary/10 rounded-sm",
      "whitespace-nowrap",
      className
    )}>
      {children || "Sem categoria"}
    </span>
  );
};

// INDICADOR DE PERFIL COM DIMENSÕES FIXAS
interface CardProfileIndicatorProps {
  skeleton?: boolean;
  className?: string;
}

export const CardProfileIndicator = ({ 
  skeleton = false,
  className 
}: CardProfileIndicatorProps) => {
  if (skeleton) {
    return (
      <div className={cn(
        "flex items-center gap-0.5 md:gap-1", // Reduzido no mobile
        "h-[20px] md:h-[24px]", // Reduzido no mobile
        "animate-pulse"
      )}>
        <div className="h-2.5 md:h-3 w-12 md:w-16 bg-muted rounded" />
        <div className="h-2.5 md:h-3 w-2.5 md:w-3 bg-muted rounded" />
      </div>
    );
  }
  
  return (
    <div className={cn(
      "flex items-center gap-0.5 md:gap-1", // Reduzido no mobile
      "h-[20px] md:h-[24px]", // Altura FIXA igual ao skeleton
      "text-primary/60 group-hover:text-primary transition-colors duration-300",
      className
    )}>
      <span className="text-[8px] md:text-[9px] font-black uppercase tracking-widest">VER PERFIL</span>
      <ArrowUpRight className="h-2.5 w-2.5 md:h-3 md:w-3 flex-shrink-0" />
    </div>
  );
};