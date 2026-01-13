"use client";
import * as React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import ServiceCard from "@/components/service-card";
import { approveServicesBatchAction, removeServicesBatchAction } from "@/app/provider/actions";
import { CheckCircle2, Trash2, Check, Loader2, MousePointer2 } from "lucide-react";
import Swal from 'sweetalert2';

// Configuração padrão dos Toasts do SweetAlert2
const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.addEventListener('mouseenter', Swal.stopTimer)
    toast.addEventListener('mouseleave', Swal.resumeTimer)
  }
});

export default function DashboardList({ initialItems, onRefresh }: { initialItems: any[], onRefresh: () => Promise<void> | void }) {
  const [selectedIds, setSelectedIds] = React.useState<number[]>([]);
  const [isProcessing, setIsProcessing] = React.useState(false);

  const toggleSelect = (id: number) => {
    if (isProcessing) return;
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const toggleSelectAll = () => {
    if (isProcessing) return;
    setSelectedIds(selectedIds.length === initialItems.length ? [] : initialItems.map(p => p.id));
  };

  const handleBatchAction = async (type: "approve" | "remove") => {
    const isApprove = type === "approve";
    const count = selectedIds.length;
    
    // 1. Confirmação Inicial (Popup Central)
    const result = await Swal.fire({
      title: isApprove ? 'Aprovar Negócios?' : 'Recusar Negócios?',
      text: `Deseja processar ${count} ${count > 1 ? 'itens' : 'item'} agora?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: isApprove ? '#2563eb' : '#ef4444',
      confirmButtonText: isApprove ? 'Sim, Aprovar' : 'Sim, Recusar',
      cancelButtonText: 'Cancelar',
      customClass: {
        popup: 'rounded-[2.5rem] p-8',
        confirmButton: 'rounded-xl font-black uppercase text-xs tracking-widest px-8 py-4',
        cancelButton: 'rounded-xl font-bold px-8 py-4'
      }
    });

    if (result.isConfirmed) {
      setIsProcessing(true);

      try {
        // 2. Execução da Action no Servidor
        const res = isApprove 
          ? await approveServicesBatchAction(selectedIds) 
          : await removeServicesBatchAction(selectedIds);
        
        if (res.success) {
          // 3. Sincronização automática com o servidor
          await onRefresh(); 
          
          // 4. Feedback via TOAST (Canto Superior)
          Toast.fire({
            icon: 'success',
            title: isApprove ? 'Aprovado com sucesso!' : 'Removido com sucesso!',
            text: `${count} negócios foram atualizados.`
          });

          setSelectedIds([]);
        } else {
          throw new Error();
        }
      } catch (error) {
        Toast.fire({
          icon: 'error',
          title: 'Erro na operação',
          text: 'Não foi possível sincronizar com o servidor.'
        });
      } finally {
        setIsProcessing(false);
      }
    }
  };

  return (
    <div className={`space-y-6 transition-all duration-500 ${isProcessing ? 'opacity-60 grayscale-[0.5]' : 'opacity-100'}`}>
      
      {/* BARRA DE STATUS / SELEÇÃO */}
      {initialItems.length > 0 && (
        <div className="flex items-center justify-between px-6 py-4 bg-white border border-slate-200 rounded-3xl shadow-sm">
          <div className="flex items-center gap-4">
            <Checkbox 
              checked={selectedIds.length === initialItems.length && initialItems.length > 0}
              onCheckedChange={toggleSelectAll}
              disabled={isProcessing}
              className="h-6 w-6 rounded-lg border-slate-300 data-[state=checked]:bg-blue-600 border-2"
            />
            <div className="flex flex-col">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 leading-none mb-1">Status da Seleção</span>
              <span className="text-sm font-bold text-slate-700">
                {selectedIds.length} de {initialItems.length} selecionados
              </span>
            </div>
          </div>
          {selectedIds.length > 0 && !isProcessing && (
            <Button variant="ghost" onClick={() => setSelectedIds([])} className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:bg-blue-50">
              Desmarcar Tudo
            </Button>
          )}
        </div>
      )}

      {/* GRID DE CARDS */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {initialItems.map((p) => (
          <div key={p.id} onClick={() => toggleSelect(p.id)} className="group relative">
            <Card 
              className={`relative transition-all duration-500 rounded-[2.5rem] p-6 border-2 cursor-pointer ${
                selectedIds.includes(p.id) 
                  ? 'border-blue-600 bg-blue-50/30 shadow-2xl scale-[0.98]' 
                  : 'border-white bg-white shadow-sm hover:border-slate-200 hover:shadow-xl'
              }`}
            >
              <div className="space-y-4">
                <ServiceCard service={p} />
                
                <div className="flex gap-2 mt-4 pt-4 border-t border-slate-100">
                  <Button 
                    disabled={isProcessing}
                    onClick={(e) => { e.stopPropagation(); setSelectedIds([p.id]); handleBatchAction("approve"); }}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black h-10 text-[10px] uppercase tracking-widest"
                  >
                    {isProcessing && selectedIds.includes(p.id) ? <Loader2 className="h-4 w-4 animate-spin" /> : "Aprovar"}
                  </Button>
                  <Button 
                    disabled={isProcessing}
                    onClick={(e) => { e.stopPropagation(); setSelectedIds([p.id]); handleBatchAction("remove"); }}
                    variant="ghost"
                    className="h-10 px-4 rounded-2xl text-slate-300 hover:text-red-500 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {selectedIds.includes(p.id) && (
                <div className="absolute -top-2 -right-2 bg-blue-600 text-white rounded-full p-1.5 shadow-lg ring-4 ring-white">
                  <Check className="h-4 w-4 stroke-[4px]" />
                </div>
              )}
            </Card>
          </div>
        ))}
      </div>

      {/* BARRA FLUTUANTE (DOCK) */}
      {selectedIds.length > 0 && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 flex items-center gap-8 bg-slate-900 border border-slate-800 px-8 py-5 rounded-[2.5rem] shadow-[0_30px_60px_rgba(0,0,0,0.3)] animate-in fade-in slide-in-from-bottom-10 duration-500">
          <div className="flex items-center gap-4 pr-8 border-r border-slate-700">
            <div className="h-12 w-12 bg-blue-600 text-white rounded-2xl flex items-center justify-center font-black text-lg rotate-3 shadow-lg shadow-blue-500/20">
              {isProcessing ? <Loader2 className="h-6 w-6 animate-spin" /> : selectedIds.length}
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] leading-none mb-1">Ação em Lote</p>
              <p className="text-sm font-bold text-white leading-none">Selecionados</p>
            </div>
          </div>
          
          <div className="flex gap-4">
            <Button 
              disabled={isProcessing}
              onClick={() => handleBatchAction("approve")} 
              className="bg-blue-600 hover:bg-blue-700 text-white font-black rounded-2xl flex gap-3 h-12 px-8 text-xs uppercase tracking-widest transition-all active:scale-95 shadow-lg shadow-blue-500/20"
            >
              {isProcessing ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
              {isProcessing ? "Sincronizando..." : "Aprovar"}
            </Button>
            <Button 
              disabled={isProcessing}
              onClick={() => handleBatchAction("remove")} 
              className="bg-transparent text-red-400 hover:bg-red-500/10 hover:text-red-300 font-black rounded-2xl flex gap-3 h-12 px-6 text-xs uppercase tracking-widest transition-all"
            >
              <Trash2 className="h-4 w-4" /> Recusar
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}