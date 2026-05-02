"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import Header from "@/components/header";
import { supabase } from "@/lib/supabase";
import { Loader2, Save, ArrowLeft, User, Phone, FileText, Trash2, Settings2 } from "lucide-react";
import { showLoading, notify, confirmDestructiveAction } from "@/lib/swal";
import Link from "next/link";

const formatPhoneNumber = (value: string) => {
  if (!value) return value;
  const phoneNumber = value.replace(/[^\d]/g, "");
  const len = phoneNumber.length;
  if (len < 3) return phoneNumber;
  if (len < 7) return `(${phoneNumber.slice(0, 2)}) ${phoneNumber.slice(2)}`;
  return `(${phoneNumber.slice(0, 2)}) ${phoneNumber.slice(2, 7)}-${phoneNumber.slice(7, 11)}`;
};

export default function EditProfile() {
  const [form, setForm] = React.useState({ name: "", phone: "", bio: "" });
  const [userEmail, setUserEmail] = React.useState("");
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const [deleting, setDeleting] = React.useState(false);
  const router = useRouter();

  React.useEffect(() => {
    async function loadInitialData() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user?.email) {
        setUserEmail(user.email);
        try {
          const res = await fetch(`/api/user/profile?email=${user.email}`);
          if (res.ok) {
            const data = await res.json();
            setForm({
              name: data.name || "",
              phone: data.phone || "",
              bio: data.bio || ""
            });
          }
        } catch (err) { console.error("Erro na carga do perfil:", err); }
      }
      setLoading(false);
    }
    loadInitialData();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    // 1. Modal de Sincronização Neon (Padronizado via lib/swal)
    showLoading('Sincronizando...', 'Atualizando seus dados na rede Ecosol.');

    try {
      const res = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, email: userEmail }),
      });

      // 2. GESTOR AUTOMÁTICO: Fecha o Swal e dispara o Toast Neon Simétrico
      notify.auto(res.ok, 'Perfil atualizado com sucesso!', 'Erro ao salvar alterações');

      if (res.ok) {
        router.push("/profile");
        router.refresh(); 
      }
    } catch (err) {
      console.error("Erro ao salvar perfil:", err);
      // Notificação de erro automática
      notify.error("Falha na conexão com o servidor.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteAccount() {
    const result = await confirmDestructiveAction(
      "Excluir Conta Permanentemente",
      "Esta ação não pode ser desfeita. Todos os seus dados, cadastros e histórico serão removidos do Ecosol. Deseja continuar?",
      "Sim, Excluir Minha Conta",
      "Cancelar"
    );

    if (result.isConfirmed) {
      setDeleting(true);
      
      try {
        showLoading('Processando...', 'Removendo sua conta do sistema Ecosol.');
        
        const res = await fetch("/api/user/delete-account", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
        });

        const data = await res.json();

        if (res.ok) {
          if (data.warning) {
            notify.success("Conta removida do sistema! " + data.message);
          } else {
            notify.success("Conta excluída com sucesso!");
          }
          
          // Deslogar e redirecionar
          await supabase.auth.signOut();
          
          setTimeout(() => {
            window.location.href = "/";
          }, 2000);
          
        } else {
          notify.error(data.error || "Erro ao excluir conta.");
        }
      } catch (err) {
        console.error("Erro ao excluir conta:", err);
        notify.error("Falha na conexão com o servidor.");
      } finally {
        setDeleting(false);
      }
    }
  }

  if (loading) return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <div className="flex-1 flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
        <p className="font-black text-muted-foreground uppercase tracking-widest text-[10px] animate-pulse">
          Carregando Perfil...
        </p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300 pb-20">
      <Header />
      <main className="mx-auto max-w-6xl p-6 py-12 flex flex-col items-center">
        {/* NAVEGAÇÃO SUPERIOR PADRONIZADA */}
        <div className="w-full mb-10 flex justify-start">
          <Link 
            href="/profile" 
            className="group inline-flex items-center gap-2 text-primary text-[10px] font-black uppercase tracking-[0.2em] hover:opacity-80 transition-all bg-primary/5 px-4 py-2.5 rounded-xl border border-primary/10"
          >
            <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" /> 
            <span>Voltar ao Perfil</span>
          </Link>
        </div>

        {/* HEADER DA PÁGINA: ICONBOX PADRONIZADO */}
        <section className="w-full flex flex-col items-center mb-12 gap-5 text-center">
          <div className="p-4 bg-primary/10 rounded-3xl text-primary shadow-inner">
            <Settings2 size={32} />
          </div>
          <div>
            <h2 className="text-3xl font-black tracking-tighter text-foreground uppercase leading-none">
              Editar Perfil
            </h2>
            <p className="text-muted-foreground font-medium mt-1">
              Mantenha seus dados de contato atualizados na rede <span className="text-primary font-bold">Ecosol</span>.
            </p>
          </div>
        </section>

        {/* CARD CENTRALIZADO */}
        <div className="w-full max-w-2xl">
          <form 
            onSubmit={handleSubmit} 
            className="bg-card p-8 md:p-12 rounded-[2.5rem] border border-border shadow-xl space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500"
          >
            <div className="space-y-8">
              <div className="space-y-3">
                <label className="flex items-center gap-2 text-[10px] font-black text-muted-foreground uppercase tracking-[0.25em] ml-1">
                  <User className="w-3.5 h-3.5" /> Nome Completo
                </label>
                <Input 
                  value={form.name} 
                  onChange={e => setForm({...form, name: e.target.value})} 
                  className="h-14 rounded-2xl bg-muted/30 focus:bg-background border-border font-bold text-base transition-all"
                  placeholder="Como você quer ser chamado?"
                />
              </div>

              <div className="space-y-3">
                <label className="flex items-center gap-2 text-[10px] font-black text-muted-foreground uppercase tracking-[0.25em] ml-1">
                  <Phone className="w-3.5 h-3.5" /> WhatsApp Comercial
                </label>
                <Input 
                  value={form.phone} 
                  onChange={e => setForm({...form, phone: formatPhoneNumber(e.target.value)})} 
                  className="h-14 rounded-2xl bg-muted/30 focus:bg-background border-border font-bold text-base transition-all"
                  placeholder="(00) 00000-0000"
                  maxLength={15}
                />
              </div>

              <div className="space-y-3">
                <label className="flex items-center gap-2 text-[10px] font-black text-muted-foreground uppercase tracking-[0.25em] ml-1">
                  <FileText className="w-3.5 h-3.5" /> Bio / Descrição Pessoal
                </label>
                <textarea 
                  className="w-full border border-border bg-muted/30 rounded-3xl p-6 text-base font-medium h-44 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-inner text-foreground placeholder:text-muted-foreground/40 resize-none"
                  placeholder="Conte um pouco sobre você..."
                  value={form.bio} 
                  onChange={e => setForm({...form, bio: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-4">
              <Button 
                type="submit" 
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-4xl h-16 font-black text-lg shadow-lg shadow-primary/20 gap-3 transition-all active:scale-[0.98]" 
                disabled={saving}
              >
                {saving ? <Loader2 className="animate-spin" /> : <Save className="w-5 h-5" />}
                {saving ? "Salvando Dados..." : "Confirmar Alterações"}
              </Button>

              <div className="pt-6 border-t border-border/50">
                <h3 className="text-sm font-black text-destructive uppercase tracking-widest mb-3">
                  Zona de Risco
                </h3>
                <p className="text-xs text-muted-foreground mb-4">
                  Esta ação removerá permanentemente sua conta e todos os dados associados do sistema Ecosol.
                </p>
                <Button 
                  type="button"
                  variant="destructive"
                  onClick={handleDeleteAccount}
                  disabled={deleting}
                  className="w-full h-12 rounded-2xl font-black text-[10px] uppercase tracking-widest gap-2 shadow-lg shadow-destructive/20 hover:shadow-destructive/30 transition-all"
                >
                  {deleting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Trash2 className="w-4 h-4" />
                  )}
                  {deleting ? "Excluindo Conta..." : "Excluir Minha Conta Permanentemente"}
                </Button>
              </div>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}