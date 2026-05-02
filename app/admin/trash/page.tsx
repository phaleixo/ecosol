"use client";

import * as React from "react";
import Header from "@/components/header";
import TrashList from "./trash-list";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2, ArrowLeft, Trash2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function AdminTrashPage() {
  const [items, setItems] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [isAdmin, setIsAdmin] = React.useState(false);
  const router = useRouter();

  async function loadTrashed() {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user?.email) {
        const roleRes = await fetch(`/api/user/role?email=${session.user.email}`);
        const { role } = await roleRes.json();
        setIsAdmin(role === 'ADMIN');
      }

      const res = await fetch("/api/admin/trash", { 
        cache: 'no-store',
        headers: { 'Pragma': 'no-cache', 'Cache-Control': 'no-cache' }
      }); 
      
      if (res.ok) {
        const data = await res.json();
        setItems(data);
        router.refresh(); 
      }
    } catch (err) {
      console.error("Erro ao carregar lixeira:", err);
    } finally {
      setLoading(false);
    }
  }

  React.useEffect(() => {
    loadTrashed();
  }, []);

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
            href="/admin/dashboard" 
            className="group inline-flex items-center gap-2 text-primary text-[10px] font-black uppercase tracking-[0.2em] hover:opacity-80 transition-all bg-primary/5 px-4 py-2.5 rounded-xl border border-primary/10"
          >
            <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" /> 
            <span>Voltar ao Dashboard</span>
          </Link>
        </div>

        {/* HEADER DA PÁGINA: ESTRUTURA ESPELHADA */}
        <section className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-12 gap-6">
          <div className="flex items-center gap-5">
            <div className="p-4 bg-primary/10 rounded-3xl text-primary shadow-inner">
              <Trash2 size={32} />
            </div>
            <div>
              <h2 className="text-3xl font-black tracking-tighter text-foreground uppercase leading-none">Lixeira do Sistema</h2>
              <p className="text-muted-foreground font-medium mt-1">Recupere cadastros ou elimine dados permanentemente.</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 w-full sm:w-auto">
            {/* Espaço reservado para manter a simetria com o botão da Lixeira no Dashboard */}
            <div className="bg-primary text-primary-foreground px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-primary/20 whitespace-nowrap">
              {items.length} Itens no Limbo
            </div>
          </div>
        </section>

        <TrashList items={items} onRefresh={loadTrashed} isAdmin={isAdmin} />
      </main>
    </div>
  );
}