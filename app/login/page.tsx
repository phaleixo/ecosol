"use client";

import * as React from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTheme } from "next-themes";
import Link from "next/link";
import { Loader2, Mail, Lock, Sun, Moon, ArrowRight, CheckCircle2, AlertCircle,UserCircle2,KeyRound,ArrowLeft,ShieldCheck} from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [isResetting, setIsResetting] = React.useState(false);
  const [message, setMessage] = React.useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [mounted, setMounted] = React.useState(false);
  
  const router = useRouter();
  const { theme, setTheme } = useTheme();

  // Previne erro de hidratação no seletor de tema
  React.useEffect(() => setMounted(true), []);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    // 1. Autenticação Primária via Supabase
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password });

    if (authError) {
      setMessage({ type: 'error', text: "E-mail ou senha incorretos." });
      setLoading(false);
      return;
    }

    // 2. Verificação de Role via API (Engenharia de Redirecionamento)
    try {
      const res = await fetch(`/api/user/role?email=${email}`);
      if (!res.ok) throw new Error("Falha ao validar permissões");
      
      const { role } = await res.json();
      router.refresh(); // Sincroniza cookies/sessão com o Middleware

      if (role === "ADMIN") {
        router.push("/admin/dashboard");
      } else {
        router.push("/profile");
      }
    } catch (err) {
      console.error("Erro na busca de role:", err);
      router.push("/");
    } finally {
      setLoading(false);
    }
  }

  async function handleForgotPassword(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/update-password`,
    });

    if (error) {
      setMessage({ type: 'error', text: error.message });
    } else {
      setMessage({ type: 'success', text: "Link de recuperação enviado ao seu e-mail." });
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground p-2 transition-colors duration-500">
      
      {/* Botão de Tema Flutuante Otimizado */}
      <button
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        className="fixed top-4 right-4 p-2.5 bg-card border border-border rounded-xl shadow-sm hover:bg-muted transition-all text-primary z-50"
      >
        {mounted && (theme === "dark" ? <Sun size={18} /> : <Moon size={18} />)}
      </button>

      <div className="w-full max-w-95 animate-in fade-in zoom-in-95 duration-500">
        <div className="bg-card p-6 md:p-8 rounded-4xl shadow-xl border border-border relative overflow-hidden">
          
          {/* Cabeçalho de Identidade Reduzido */}
          <div className="text-center mb-6">
            <div className="inline-flex p-3 bg-primary/5 rounded-2xl mb-3 text-primary border border-primary/10 shadow-inner">
               {isResetting ? <KeyRound size={24} /> : <UserCircle2 size={24} />}
            </div>
            <h1 className="text-2xl font-black tracking-tighter uppercase leading-none">
              {isResetting ? "Recuperar" : "Bem-vindo"}
            </h1>
            <p className="text-muted-foreground text-[9px] font-black uppercase tracking-[0.2em] mt-2">
              {isResetting ? "Redefinição de Acesso" : "Rede Ecosol Autista"}
            </p>
          </div>

          {/* Mensagens de Feedback Semântico */}
          {message && (
            <div className={`mb-4 p-3 rounded-xl text-[10px] font-black uppercase tracking-widest border flex items-center gap-2 animate-in slide-in-from-top-2 ${
              message.type === 'success' 
                ? 'bg-primary/5 border-primary/20 text-primary' 
                : 'bg-destructive/5 border-destructive/20 text-destructive'
            }`}>
              {message.type === 'success' ? <CheckCircle2 size={14} /> : <AlertCircle size={14} />}
              <span className="leading-tight text-center">{message.text}</span>
            </div>
          )}

          <form onSubmit={isResetting ? handleForgotPassword : handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[9px] font-black text-muted-foreground/60 uppercase tracking-widest ml-1">E-mail de Acesso</label>
              <div className="relative">
                <Input 
                  type="email" 
                  required 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  placeholder="seu@email.com"
                  className="h-11 pl-10 rounded-xl bg-muted/20 border-border focus:bg-background font-bold text-sm transition-all focus:ring-1 ring-primary/30"
                />
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/30" size={16} />
              </div>
            </div>

            {!isResetting && (
              <div className="space-y-1.5">
                <div className="flex justify-between items-center px-1">
                  <label className="text-[9px] font-black text-muted-foreground/60 uppercase tracking-widest">Senha</label>
                  <button 
                    type="button"
                    onClick={() => { setIsResetting(true); setMessage(null); }}
                    className="text-[9px] font-black text-primary hover:opacity-70 uppercase tracking-widest transition-all"
                  >
                    Esqueceu?
                  </button>
                </div>
                <div className="relative">
                  <Input 
                    type="password" 
                    required 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    placeholder="••••••••"
                    className="h-11 pl-10 rounded-xl bg-muted/20 border-border focus:bg-background font-bold text-sm transition-all focus:ring-1 ring-primary/30"
                  />
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/30" size={16} />
                </div>
              </div>
            )}

            <Button 
              type="submit" 
              className="w-full h-12 rounded-2xl font-black text-sm shadow-md hover:shadow-primary/10 gap-2 transition-all active:scale-[0.98]" 
              disabled={loading}
            >
              {loading ? <Loader2 className="animate-spin" size={16} /> : (isResetting ? <ShieldCheck size={18} /> : <ArrowRight size={18} />)}
              {loading ? "PROCESSANDO..." : (isResetting ? "ENVIAR LINK" : "ENTRAR NA REDE")}
            </Button>

            {isResetting && (
              <button 
                type="button" 
                className="w-full flex items-center justify-center gap-2 text-[9px] font-black text-muted-foreground hover:text-foreground uppercase tracking-widest transition-all mt-1"
                onClick={() => { setIsResetting(false); setMessage(null); }}
              >
                <ArrowLeft size={12} /> Voltar ao Login
              </button>
            )}
          </form>

          {!isResetting && (
            <div className="mt-6 text-center border-t border-border pt-4">
              <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">
                Ainda não faz parte?{" "}
                <Link href="/signup" className="text-primary font-black hover:underline ml-1">
                  Criar conta agora
                </Link>
              </p>
            </div>
          )}
        </div>
        
        {/* Footer de Engenharia Compacto */}
        <p className="text-center mt-6 text-[8px] text-muted-foreground/30 font-black uppercase tracking-[0.4em]">
          Acesso Protegido &bull; Ecosol 2026
        </p>
      </div>
    </div>
  );
}