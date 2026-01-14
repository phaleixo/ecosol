"use client";

import React from 'react';
import { cn } from "@/lib/utils";

interface DockProps {
  children: React.ReactNode;
  className?: string;
}

export default function Dock({ children, className }: DockProps) {
  return (
    <div className="fixed bottom-8 left-0 right-0 z-50 flex justify-center pointer-events-none px-4">
      <nav className={cn(
        "flex items-center bg-card/95 backdrop-blur-xl border border-primary/40 rounded-2xl shadow-xl shadow-primary/20 px-4 py-3 w-full max-w-lg md:max-w-xl pointer-events-auto",
        "animate-in fade-in slide-in-from-bottom-4 duration-500",
        className
      )}>
        {children}
      </nav>
    </div>
  );
}