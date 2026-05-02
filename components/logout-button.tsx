"use client";

import { Button } from "./ui/button";
import { supabase } from "@/lib/supabase";
import { LogOut } from "lucide-react";

interface LogoutButtonProps {
  mobile?: boolean;
  className?: string;
}

export default function LogoutButton({ mobile = false, className = "" }: LogoutButtonProps) {
  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
    } catch {
      // ignore
    }
    window.location.href = "/";
  };

  if (mobile) {
    return (
      <Button
        variant="destructive"
        size="sm"
        className={`h-11 rounded-xl font-black text-[10px] uppercase tracking-widest gap-2 shadow-destructive/10 hover:shadow-destructive/20 px-3 ${className}`}
        onClick={handleLogout}
        title="Encerrar Sessão"
      >
        <LogOut className="w-5 h-5" />
      </Button>
    );
  }

  return (
    <Button
      variant="destructive"
      size="sm"
      className={`h-10 rounded-xl font-black text-[10px] uppercase tracking-widest gap-2 shadow-destructive/10 hover:shadow-destructive/20 px-4 ${className}`}
      onClick={handleLogout}
    >
      <LogOut className="w-4 h-4" />
      <span>Encerrar Sessão</span>
    </Button>
  );
}