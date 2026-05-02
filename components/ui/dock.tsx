"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";

interface DockProps {
  children: React.ReactNode;
  className?: string;
  showLogout?: boolean;
}

export default function Dock({
  children,
  className,
  showLogout = false,
}: DockProps) {
  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
    } catch {
      // ignore
    }
    window.location.href = "/";
  };
  return (
    <div className="fixed bottom-8 left-0 right-0 z-50 flex justify-center pointer-events-none px-4">
      <nav
        className={cn(
          "flex items-center bg-card/95 backdrop-blur-xl border border-primary/40 rounded-2xl shadow-xl shadow-primary/20 px-4 py-3 w-full max-w-lg md:max-w-xl pointer-events-auto",
          "animate-in fade-in slide-in-from-bottom-4 duration-500",
          className
        )}
      >
        {children}
        {showLogout && (
          <div className="ml-4">
            <Button
              variant="ghost"
              className="text-destructive border-destructive/10 hover:bg-destructive/5"
              onClick={handleLogout}
            >
              Encerrar Sessão
            </Button>
          </div>
        )}
      </nav>
    </div>
  );
}
