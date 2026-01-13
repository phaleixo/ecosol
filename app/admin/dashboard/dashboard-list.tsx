"use client";
import * as React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import ServiceCard from "@/components/service-card";
import { approveServicesBatchAction, removeServicesBatchAction } from "@/app/provider/actions";
import { CheckCircle2, Trash2, ShieldCheck, XCircle, Check } from "lucide-react";
import Swal from 'sweetalert2';

export default function DashboardList({ initialItems, onRefresh }: { initialItems: any[], onRefresh: () => void }) {
  const [selectedIds, setSelectedIds] = React.useState<number[]>([]);

  const toggleSelect = (id: number) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const toggleSelectAll = () => {
    setSelectedIds(selectedIds.length === initialItems.length ? [] : initialItems.map(p => p.id));
  };

  // Integração com SweetAlert2 para confirmações em lote
  const handleBatchAction = async (type: "approve" | "remove") => {
    const isApprove = type === "approve";
    
    const result = await Swal.fire({
      title: isApprove ? 'Aprovar Seleção?' : 'Recusar Seleção?',
      text: `Você irá processar ${selectedIds.length} itens de uma só vez.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: isApprove ? '#2563eb' : '#ef4444',
      cancelButtonColor: '#94a3b8',
      confirmButtonText: isApprove ? 'Sim, Aprovar Todos' : 'Sim, Recusar Todos',
      cancelButtonText: 'Cancelar',
      customClass: {
        popup: 'rounded-[2rem] border-none shadow-2xl',
        title: 'font-black tracking-tight text-slate-900',
        confirmButton: 'rounded-xl font-bold px-6 py-3',
        cancelButton: 'rounded-xl font-bold px-6 py-3'
      }
    });

    if (result.isConfirmed) {
      const res = isApprove 
        ? await approveServicesBatchAction(selectedIds) 
        : await removeServicesBatchAction(selectedIds);
      
      if (res.success) {
        Swal.fire({ icon: 'success', title: 'Processado!', showConfirmButton: false, timer: 1500 });
        setSelectedIds([]);
        onRefresh();
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* BARRA DE SELEÇÃO - Sólida e Discreta */}
      {initialItems.length > 0 && (
        <div className="flex items-center justify-between px-6 py-4 bg-white border border-slate-200 rounded-2xl shadow-sm">
          <div className="flex items-center gap-4">
            <Checkbox 
              checked={selectedIds.length === initialItems.length && initialItems.length > 0}
              onCheckedChange={toggleSelectAll}
              className="h-5 w-5 rounded-md border-slate-300 data-[state=checked]:bg-blue-600"
            />
            <span className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">
              {selectedIds.length > 0 ? `${selectedIds.length} Itens Selecionados` : "Marcar Todos"}
            </span>
          </div>
          {selectedIds.length > 0 && (
            <button onClick={() => setSelectedIds([])} className="text-[11px] font-black text-blue-600 uppercase hover:underline">
              Limpar Seleção
            </button>
          )}
        </div>
      )}

      {/* GRID DE CARDS */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {initialItems.map((p) => (
          <div key={p.id} onClick={() => toggleSelect(p.id)} className="cursor-pointer">
            <Card 
              className={`relative transition-all duration-300 rounded-[2.5rem] p-6 border-2 ${
                selectedIds.includes(p.id) 
                  ? 'border-blue-600 bg-blue-50/50 shadow-md' 
                  : 'border-white bg-white shadow-sm hover:border-slate-100'
              }`}
            >
              <div className="space-y-4">
                <ServiceCard service={{
                  ...p,
                  whatsapp: p.whatsapp ?? undefined,
                  instagram: p.instagram ?? undefined,
                  tiktok: p.tiktok ?? undefined,
                  email: p.email ?? undefined,
                  site: p.site ?? undefined,
                }} />
                
                {/* Botões individuais mais compactos */}
                <div className="flex gap-2 mt-4 pt-4 border-t border-slate-100">
                  <Button 
                    onClick={(e) => { e.stopPropagation(); setSelectedIds([p.id]); handleBatchAction("approve"); }}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-black h-9 text-[10px] uppercase tracking-widest shadow-sm"
                  >
                    Aprovar
                  </Button>
                  <Button 
                    onClick={(e) => { e.stopPropagation(); setSelectedIds([p.id]); handleBatchAction("remove"); }}
                    variant="ghost"
                    className="h-9 px-3 rounded-xl text-slate-300 hover:text-red-500 hover:bg-red-50 font-bold"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {selectedIds.includes(p.id) && (
                <div className="absolute top-4 right-4 bg-blue-600 text-white rounded-full p-1 shadow-md">
                  <Check className="h-3 w-3 stroke-[4px]" />
                </div>
              )}
            </Card>
          </div>
        ))}
      </div>

      {/* BARRA FLUTUANTE - Sólida, Sem Glassmorphism, Botões Menores */}
      {selectedIds.length > 0 && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex items-center gap-6 bg-white border-2 border-blue-600 px-8 py-4 rounded-full shadow-[0_20px_40px_rgba(0,0,0,0.1)] animate-in fade-in slide-in-from-bottom-8 duration-300">
          <div className="flex items-center gap-4 pr-6 border-r border-slate-100">
            <div className="h-10 w-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-black text-sm">
              {selectedIds.length}
            </div>
            <p className="text-[10px] font-black text-slate-900 uppercase tracking-widest leading-none">
              Itens<br/>Selecionados
            </p>
          </div>
          
          <div className="flex gap-3">
            <Button onClick={() => handleBatchAction("approve")} className="bg-blue-600 hover:bg-blue-700 text-white font-black rounded-full flex gap-2 h-10 px-6 text-[11px] uppercase tracking-wider shadow-lg shadow-blue-200 transition-all active:scale-95">
              <CheckCircle2 className="h-4 w-4" /> Aprovar Seleção
            </Button>
            <Button onClick={() => handleBatchAction("remove")} variant="ghost" className="text-red-500 hover:bg-red-50 hover:text-red-600 font-black rounded-full flex gap-2 h-10 px-6 text-[11px] uppercase tracking-wider transition-all active:scale-95">
              <Trash2 className="h-4 w-4" /> Recusar Seleção
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}