"use client";

import * as React from "react";
import Link from "next/link";
import Header from "@/components/header";
import { Button } from "@/components/ui/button";
import DashboardList from "./dashboard-list";
import { Loader2, Trash2, LayoutDashboard, ArrowLeft } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function AdminDashboard() {
  const [pending, setPending] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [isAdmin, setIsAdmin] = React.useState(false);

  async function load() {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user?.email) {
        const roleRes = await fetch(`/api/user/role?email=${session.user.email}`);
        const { role } = await roleRes.json();
        setIsAdmin(role === 'ADMIN');
      }

      const res = await fetch("/api/admin/pending", { 
        cache: 'no-store',
        headers: { 'Pragma': 'no-cache', 'Cache-Control': 'no-cache' }
      });
      if (!res.ok) throw new Error("Erro ao carregar");
      const data = await res.json();
      setPending(data);
    } catch (err) {
      console.error("Erro na carga do painel:", err);
    } finally {
      setLoading(false);
    }
  }

  React.useEffect(() => { load(); }, []);

  if (loading) return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <div className="flex-1 flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
        <p className="font-black text-muted-foreground animate-pulse uppercase tracking-[0.3em] text-[10px]">
          Sincronizando Base...
        </p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background text-foreground pb-32 transition-colors duration-300">
      <Header />
      <main className="mx-auto max-w-6xl p-6 py-12">
        {/* NAVEGAÇÃO SUPERIOR PADRONIZADA */}
        <div className="mb-10">
          <Link 
            href="/" 
            className="group inline-flex items-center gap-2 text-primary text-[10px] font-black uppercase tracking-[0.2em] hover:opacity-80 transition-all bg-primary/5 px-4 py-2.5 rounded-xl border border-primary/10"
          >
            <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" /> 
            <span>Voltar ao Início</span>
          </Link>
        </div>

        {/* HEADER DA PÁGINA: ESTRUTURA ESPELHADA */}
        <section className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-12 gap-6">
          <div className="flex items-center gap-5">
            <div className="p-4 bg-primary/10 rounded-3xl text-primary shadow-inner">
              <LayoutDashboard size={32} />
            </div>
            <div>
              <h2 className="text-3xl font-black tracking-tighter text-foreground uppercase leading-none">Painel Administrativo</h2>
              <p className="text-muted-foreground font-medium mt-1">Controle de qualidade e curadoria de dados.</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 w-full sm:w-auto">
            {isAdmin && (
              <Link href="/admin/trash" className="flex-1 sm:flex-none">
                <Button variant="outline" className="w-full rounded-2xl border-border bg-card font-black text-[10px] uppercase tracking-widest h-12 px-6 shadow-sm hover:bg-muted gap-2">
                  <Trash2 size={16} /> Lixeira
                </Button>
              </Link>
            )}
            <div className="bg-primary text-primary-foreground px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-primary/20 whitespace-nowrap">
              {pending.length} Pendentes
            </div>
          </div>
        </section>

        <DashboardList initialItems={pending} onRefresh={load} isAdmin={isAdmin} />
      </main>
    </div>
  );
}