"use client";
import * as React from "react";
import Link from "next/link";
import Header from "@/components/header";
import { Button } from "@/components/ui/button";
import DashboardList from "./dashboard-list"; // O novo componente que criamos

export default function AdminDashboard() {
  const [pending, setPending] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  async function load() {
    try {
      const res = await fetch("/api/admin/pending");
      if (!res.ok) throw new Error("Erro ao carregar");
      const data = await res.json();
      setPending(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  React.useEffect(() => { load(); }, []);

  if (loading) return <div className="p-10 text-center font-bold text-slate-400 animate-pulse">Carregando painel...</div>;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-32">
      <Header />
      <main className="mx-auto max-w-6xl p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-10 gap-4">
          <div>
            <h2 className="text-4xl font-black tracking-tighter text-slate-900">Painel de Controle</h2>
            <p className="text-slate-500 font-medium">Aprovação de serviços na rede Ecosol.</p>
          </div>
          
          <div className="flex items-center gap-3">
            <Link href="/admin/trash">
              <Button variant="outline" className="rounded-2xl border-slate-200 bg-white font-bold h-12 px-6 shadow-sm hover:bg-slate-50">
                🗑️ Ver Lixeira
              </Button>
            </Link>
            <div className="bg-blue-600 text-white px-6 py-2.5 rounded-2xl text-sm font-black shadow-lg shadow-blue-100">
              {pending.length} Pendentes
            </div>
          </div>
        </div>

        {/* Componente de Lista que abstrai toda a lógica de seleção e batch */}
        <DashboardList initialItems={pending} onRefresh={load} />
      </main>
    </div>
  );
}