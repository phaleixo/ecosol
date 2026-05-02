"use client";

import * as React from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTheme } from "next-themes";
import Link from "next/link";
import {
  UserPlus,
  Mail,
  Lock,
  Loader2,
  Sun,
  Moon,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  ShieldCheck,
} from "lucide-react";

export default function SignupPage() {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [acceptedTerms, setAcceptedTerms] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [message, setMessage] = React.useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [mounted, setMounted] = React.useState(false);

  const { theme, setTheme } = useTheme();

  React.useEffect(() => setMounted(true), []);

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();

    if (!acceptedTerms) {
      setMessage({ type: "error", text: "O aceite dos termos é obrigatório." });
      return;
    }

    if (password !== confirmPassword) {
      setMessage({ type: "error", text: "As senhas não conferem." });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      /**
       * REGISTRO JURÍDICO (LGPD):
       * Armazenamos a versão dos termos e o Timestamp nos metadados do Supabase
       */
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/login`,
          data: {
            display_name: email.split("@")[0],
            accepted_terms: true,
            terms_version: "1.0.2",
            accepted_at: new Date().toISOString(),
          },
        },
      });

      if (error) {
        setMessage({ type: "error", text: error.message });
        setLoading(false);
        return;
      }

      if (data.user) {
        // Sincronização com Banco de Dados via Prisma (Route Handler)
        fetch("/api/user/create", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: data.user.email,
            name: email.split("@")[0],
            termsVersion: "1.0.2",
          }),
        }).catch((err) => console.error("Erro na sincronização Prisma:", err));

        setMessage({
          type: "success",
          text: "Protocolo enviado! Verifique seu e-mail para confirmar.",
        });

        setEmail("");
        setPassword("");
        setConfirmPassword("");
        setAcceptedTerms(false);
      }
    } catch (err) {
      setMessage({ type: "error", text: "Falha crítica no processamento." });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground p-2 transition-colors duration-500">
      <button
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        className="fixed top-4 right-4 p-2.5 bg-card border border-border rounded-xl shadow-sm hover:bg-muted transition-all text-primary z-50"
      >
        {mounted && (theme === "dark" ? <Sun size={18} /> : <Moon size={18} />)}
      </button>

      <div className="w-full max-w-95 animate-in fade-in zoom-in-95 duration-500">
        <div className="bg-card p-6 md:p-8 rounded-4xl shadow-xl border border-border relative overflow-hidden">
          <div className="text-center mb-6">
            <div className="inline-flex p-3 bg-primary/5 rounded-2xl mb-3 text-primary border border-primary/10 shadow-inner">
              <UserPlus size={24} />
            </div>
            <h1 className="text-2xl font-black tracking-tighter uppercase leading-none">
              Novo Cadastro
            </h1>
            <p className="text-muted-foreground text-[9px] font-black uppercase tracking-[0.2em] mt-2">
              Sistema de Autonomia Neurodivergente
            </p>
          </div>

          {message && (
            <div
              className={`mb-4 p-3 rounded-xl text-[10px] font-black uppercase tracking-widest border flex items-center gap-2 animate-in slide-in-from-top-2 ${
                message.type === "success"
                  ? "bg-primary/5 border-primary/20 text-primary"
                  : "bg-destructive/5 border-destructive/20 text-destructive"
              }`}
            >
              {message.type === "success" ? (
                <CheckCircle2 size={14} />
              ) : (
                <AlertCircle size={14} />
              )}
              <span className="leading-tight text-center">{message.text}</span>
            </div>
          )}

          <form onSubmit={handleSignup} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[9px] font-black text-muted-foreground/60 uppercase tracking-widest ml-1">
                E-mail de Cadastro
              </label>
              <div className="relative">
                <Input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="usuario@ecosol.com"
                  className="h-11 pl-10 rounded-xl bg-muted/20 border-border focus:bg-background font-bold text-sm transition-all focus:ring-1 ring-primary/30"
                />
                <Mail
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/30"
                  size={16}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[9px] font-black text-muted-foreground/60 uppercase tracking-widest ml-1">
                Senha de Acesso
              </label>
              <div className="relative">
                <Input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="h-11 pl-10 rounded-xl bg-muted/20 border-border focus:bg-background font-bold text-sm transition-all focus:ring-1 ring-primary/30"
                />
                <Lock
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/30"
                  size={16}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[9px] font-black text-muted-foreground/60 uppercase tracking-widest ml-1">
                Confirme a Senha
              </label>
              <div className="relative">
                <Input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="h-11 pl-10 rounded-xl bg-muted/20 border-border focus:bg-background font-bold text-sm transition-all focus:ring-1 ring-primary/30"
                />
                <Lock
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/30"
                  size={16}
                />
              </div>
              {confirmPassword && confirmPassword !== password && (
                <p className="text-[10px] font-black uppercase tracking-widest text-destructive mt-1">
                  As senhas não conferem.
                </p>
              )}
            </div>

            {/* CHECKBOX LGPD */}
            <div
              className="flex items-center gap-3 px-1 py-1 group cursor-pointer"
              onClick={() => {
                setAcceptedTerms(!acceptedTerms);
                if (message?.type === "error") setMessage(null);
              }}
            >
              <div
                className={`h-5 w-5 shrink-0 rounded-lg border-2 transition-all flex items-center justify-center ${
                  acceptedTerms
                    ? "bg-primary border-primary shadow-[0_0_10px_rgba(var(--primary),0.3)]"
                    : "border-muted-foreground/30 bg-muted/50 group-hover:border-primary/50"
                }`}
              >
                {acceptedTerms && (
                  <CheckCircle2
                    size={12}
                    className="text-primary-foreground stroke-[3px]"
                  />
                )}
              </div>
              <p className="text-[9px] leading-none text-muted-foreground font-bold uppercase tracking-tight select-none">
                Confirmo que li e aceito os{" "}
                <Link
                  href="/terms"
                  className="text-primary font-black hover:underline"
                >
                  termos de uso
                </Link>{" "}
                da rede.
              </p>
            </div>

            <Button
              type="submit"
              className={`w-full h-12 rounded-2xl font-black text-sm shadow-md transition-all active:scale-[0.98] gap-2 ${
                acceptedTerms && password === confirmPassword
                  ? "hover:shadow-primary/10"
                  : "opacity-40 grayscale cursor-not-allowed"
              }`}
              disabled={
                loading || !acceptedTerms || password !== confirmPassword
              }
            >
              {loading ? (
                <Loader2 className="animate-spin" size={16} />
              ) : (
                <ShieldCheck size={18} />
              )}
              {loading ? "PROCESSANDO..." : "FINALIZAR CADASTRO"}
            </Button>
          </form>

          <div className="mt-6 text-center border-t border-border pt-4">
            <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest flex items-center justify-center gap-1">
              Já faz parte?{" "}
              <Link
                href="/login"
                className="text-primary inline-flex items-center gap-1 hover:underline ml-1"
              >
                <ArrowLeft size={10} /> Login
              </Link>
            </p>
          </div>
        </div>

        <p className="text-center mt-6 text-[8px] text-muted-foreground/30 font-black uppercase tracking-[0.4em]">
          LGPD Compliant &bull; Ecosol 2026
        </p>
      </div>
    </div>
  );
}
