"use client";
import * as React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import ServiceCard from "@/components/service-card";
import { approveServicesBatchAction, removeServicesBatchAction } from "@/app/provider/actions";
import { CheckCircle2, Trash2, Check, Loader2, Inbox } from "lucide-react";
import { cn } from "@/lib/utils";
import Swal from 'sweetalert2';

import { swalConfig } from "@/lib/swal";
import { notify } from "@/lib/toast";

interface DashboardListProps {
  initialItems: any[];
  onRefresh: () => Promise<void> | void;
  isAdmin?: boolean; 
}

export default function DashboardList({ initialItems, onRefresh, isAdmin = false }: DashboardListProps) {
  const [selectedIds, setSelectedIds] = React.useState<number[]>([]);
  const [isProcessing, setIsProcessing] = React.useState(false);

  const toggleSelect = (id: number) => {
    if (isProcessing || !isAdmin) return;
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const toggleSelectAll = () => {
    if (isProcessing || !isAdmin) return;
    setSelectedIds(selectedIds.length === initialItems.length ? [] : initialItems.map(p => p.id));
  };

  const handleBatchAction = async (type: "approve" | "remove", targetIds?: number[]) => {
    if (!isAdmin) return;
    const idsToProcess = targetIds || selectedIds;
    const isApprove = type === "approve";
    const count = idsToProcess.length;

    if (count === 0) return;
    
    const result = await Swal.fire({
      ...swalConfig,
      title: isApprove ? 'Aprovar Cadastros?' : 'Recusar Itens?',
      text: `Deseja processar ${count} ${count > 1 ? 'solicitações' : 'solicitação'} agora?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: isApprove ? 'Sim, Aprovar' : 'Sim, Recusar',
      customClass: {
        ...swalConfig.customClass,
        confirmButton: isApprove 
          ? swalConfig.customClass.confirmButton 
          : swalConfig.customClass.confirmButton.replace('bg-primary', 'bg-destructive').replace('shadow-primary/30', 'shadow-destructive/30')
      }
    });

    if (result.isConfirmed) {
      setIsProcessing(true);
      Swal.fire({
        ...swalConfig,
        title: 'Sincronizando...',
        didOpen: () => { Swal.showLoading(); },
        allowOutsideClick: false,
      });

      try {
        const res = isApprove 
          ? await approveServicesBatchAction(idsToProcess) 
          : await removeServicesBatchAction(idsToProcess);
        
        notify.auto(res.success, isApprove ? 'Aprovado com sucesso!' : 'Removido com sucesso!');
        
        if (res.success) {
          await onRefresh(); 
          setSelectedIds([]);
        }
      } catch (error) {
        notify.error("Erro na operação de lote");
      } finally {
        setIsProcessing(false);
      }
    }
  };

  return (
    <div className={cn("space-y-6 sm:space-y-8 transition-all duration-500 pb-24", isProcessing && "opacity-60 pointer-events-none")}>
      
      {/* BARRA DE SELEÇÃO SUPERIOR RESPONSIVA */}
      {isAdmin && initialItems.length > 0 && (
        <div className="flex items-center justify-between px-4 sm:px-8 py-3 sm:py-5 bg-card border border-border rounded-2xl sm:rounded-[2rem] shadow-sm animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="flex items-center gap-3 sm:gap-4">
            <Checkbox 
              checked={selectedIds.length === initialItems.length && initialItems.length > 0}
              onCheckedChange={toggleSelectAll}
              disabled={isProcessing}
              className="h-5 w-5 sm:h-6 sm:w-6 rounded-md sm:rounded-lg border-2"
            />
            <div className="flex flex-col">
              <span className="hidden sm:block text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground leading-none mb-1">
                Logística de Curadoria
              </span>
              <span className="text-xs sm:text-sm font-bold text-foreground">
                {selectedIds.length} <span className="hidden xs:inline">selecionados</span>
              </span>
            </div>
          </div>
          {selectedIds.length > 0 && !isProcessing && (
            <Button variant="ghost" onClick={() => setSelectedIds([])} className="h-auto p-0 sm:p-2 text-[9px] sm:text-[10px] font-black text-primary uppercase tracking-widest hover:bg-primary/10 transition-all">
              Desmarcar
            </Button>
          )}
        </div>
      )}

      {/* GRID DE CARDS */}
      <div className="grid grid-cols-1 gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {initialItems.map((p) => (
          <div key={p.id} onClick={() => toggleSelect(p.id)} className="group relative">
            <Card 
              className={cn(
                "relative transition-all duration-500 rounded-[2rem] sm:rounded-[2.5rem] p-4 sm:p-6 border-2 h-full flex flex-col",
                isAdmin && "cursor-pointer",
                selectedIds.includes(p.id) 
                  ? 'border-primary bg-primary/5 shadow-2xl scale-[0.98]' 
                  : 'border-transparent bg-card shadow-sm hover:border-border hover:shadow-xl'
              )}
            >
              <div className="space-y-4 flex-1 flex flex-col">
                <ServiceCard service={p} />
                
                {isAdmin && (
                  <div className="flex gap-2 mt-auto pt-4 border-t border-border">
                    <Button 
                      disabled={isProcessing}
                      onClick={(e) => { e.stopPropagation(); handleBatchAction("approve", [p.id]); }}
                      variant="ghost"
                      className="flex-1 h-9 sm:h-10 text-[9px] sm:text-[10px] uppercase tracking-widest text-primary hover:bg-primary/10 font-black gap-2 rounded-xl sm:rounded-2xl"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" /> Aprovar
                    </Button>
                    <Button 
                      disabled={isProcessing}
                      onClick={(e) => { e.stopPropagation(); handleBatchAction("remove", [p.id]); }}
                      variant="ghost"
                      className="h-9 sm:h-10 px-3 sm:px-4 rounded-xl sm:rounded-2xl text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    </Button>
                  </div>
                )}
              </div>

              {selectedIds.includes(p.id) && (
                <div className="absolute -top-1 -right-1 bg-primary text-primary-foreground rounded-full p-1 shadow-lg ring-2 ring-background animate-in zoom-in">
                  <Check className="h-3 w-3 sm:h-4 sm:w-4 stroke-[4px]" />
                </div>
              )}
            </Card>
          </div>
        ))}
      </div>

      {initialItems.length === 0 && (
        <div className="py-20 sm:py-32 text-center bg-card rounded-[2rem] sm:rounded-[3rem] border-2 border-dashed border-border">
          <Inbox className="w-12 h-12 sm:w-16 sm:h-16 text-muted-foreground/20 mx-auto mb-4" />
          <h3 className="text-lg sm:text-xl font-black text-foreground uppercase tracking-tight">Tudo em ordem</h3>
          <p className="text-muted-foreground text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] mt-2">Nenhum cadastro pendente</p>
        </div>
      )}

      {/* DOCK DE AÇÕES - VERSÃO MOBILE OPTIMIZED */}
      {isAdmin && selectedIds.length > 0 && (
        <div className="fixed bottom-4 sm:bottom-10 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 sm:gap-8 bg-background/95 backdrop-blur-md border-2 border-primary px-3 sm:px-8 py-3 sm:py-5 rounded-2xl sm:rounded-[2.5rem] shadow-2xl animate-in fade-in slide-in-from-bottom-10 duration-500 w-[92%] sm:w-auto">
          
          {/* Contador */}
          <div className="flex items-center gap-2 sm:gap-4 pr-3 sm:pr-8 border-r border-border">
            <div className="h-10 w-10 sm:h-12 sm:w-12 bg-primary text-primary-foreground rounded-xl sm:rounded-2xl flex items-center justify-center font-black text-sm sm:text-lg rotate-2 shadow-lg">
              {isProcessing ? <Loader2 className="h-5 w-5 animate-spin" /> : selectedIds.length}
            </div>
            <div className="hidden xs:block">
              <p className="text-[8px] sm:text-[10px] font-black text-foreground uppercase tracking-widest leading-none mb-1">Lote</p>
              <p className="text-[8px] sm:text-[10px] font-black text-muted-foreground uppercase leading-none">
                Itens
              </p>
            </div>
          </div>
          
          {/* Botões de Ação */}
          <div className="flex flex-1 sm:flex-none gap-2 sm:gap-4">
            <Button 
              disabled={isProcessing}
              onClick={() => handleBatchAction("approve")} 
              className="flex-1 sm:flex-none bg-primary hover:bg-primary/90 text-primary-foreground font-black rounded-xl sm:rounded-2xl flex gap-2 h-10 sm:h-12 px-4 sm:px-8 text-[10px] sm:text-xs uppercase tracking-widest transition-all active:scale-95"
            >
              <CheckCircle2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" /> 
              <span>Aprovar</span>
            </Button>
            <Button 
              disabled={isProcessing}
              onClick={() => handleBatchAction("remove")} 
              variant="ghost"
              className="sm:flex-none text-destructive hover:bg-destructive/10 font-black rounded-xl sm:rounded-2xl flex gap-2 h-10 sm:h-12 px-3 sm:px-6 text-[10px] sm:text-xs uppercase tracking-widest transition-all"
            >
              <Trash2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              <span className="hidden xs:inline">Recusar</span>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}