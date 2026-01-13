"use client";
import * as React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import ServiceCard from "@/components/service-card";
import { restoreServicesBatchAction, deleteServicesBatchAction } from "@/app/provider/actions";
import { Trash2, RotateCcw, AlertCircle, Loader2, Check, Inbox } from "lucide-react";
import Swal from 'sweetalert2';
import { cn } from "@/lib/utils";

import { swalConfig } from "@/lib/swal";
import { notify } from "@/lib/toast";

interface TrashListProps {
  items: any[];
  onRefresh: () => Promise<void>;
  isAdmin?: boolean; 
}

export default function TrashList({ items, onRefresh, isAdmin = false }: TrashListProps) {
  const [selected, setSelected] = React.useState<number[]>([]);
  const [isProcessing, setIsProcessing] = React.useState(false);

  const toggleSelect = (id: number) => {
    if (isProcessing || !isAdmin) return;
    setSelected(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const toggleAll = () => {
    if (isProcessing || !isAdmin) return;
    setSelected(selected.length === items.length ? [] : items.map(i => i.id));
  };

  const handleAction = async (type: "restore" | "delete", targetIds?: number[]) => {
    if (!isAdmin) return;
    const idsToProcess = targetIds || selected;
    const isRestore = type === "restore";
    const count = idsToProcess.length;

    if (count === 0) return;

    const result = await Swal.fire({
      ...swalConfig,
      title: isRestore ? 'Restaurar Cadastros?' : 'Eliminar Permanente?',
      text: isRestore 
        ? `Deseja retornar ${count} ${count > 1 ? 'itens' : 'item'} para a lista ativa?` 
        : `Atenção: Ação irreversível para ${count} ${count > 1 ? 'itens' : 'item'} no banco de dados.`,
      icon: isRestore ? 'question' : 'warning',
      showCancelButton: true,
      confirmButtonText: isRestore ? 'Sim, Restaurar' : 'Sim, Apagar Tudo',
      customClass: {
        ...swalConfig.customClass,
        confirmButton: isRestore 
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
        const res = isRestore 
          ? await restoreServicesBatchAction(idsToProcess) 
          : await deleteServicesBatchAction(idsToProcess);
        
        notify.auto(
          res.success, 
          isRestore ? 'Restaurado com sucesso!' : 'Eliminado permanentemente!',
          'Falha na sincronização dos dados.'
        );
        
        if (res.success) {
          await onRefresh();
          setSelected([]);
        }
      } catch (error) {
        notify.error("Erro crítico ao processar lixeira.");
      } finally {
        setIsProcessing(false);
      }
    }
  };

  return (
    <div className={cn("space-y-6 sm:space-y-8 transition-all duration-500 pb-24", isProcessing && "opacity-60 pointer-events-none")}>
      
      {/* BARRA DE SELEÇÃO SUPERIOR RESPONSIVA */}
      {isAdmin && items.length > 0 && (
        <div className="flex items-center justify-between px-4 sm:px-8 py-3 sm:py-5 bg-card border border-border rounded-2xl sm:rounded-[2rem] shadow-sm animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="flex items-center gap-3 sm:gap-4">
            <Checkbox 
              checked={selected.length === items.length && items.length > 0} 
              onCheckedChange={toggleAll}
              disabled={isProcessing}
              className="h-5 w-5 sm:h-6 sm:w-6 rounded-md sm:rounded-lg border-2"
            />
            <div className="flex flex-col">
              <span className="hidden sm:block text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground leading-none mb-1">Status da Lixeira</span>
              <span className="text-xs sm:text-sm font-bold text-foreground">
                {selected.length} <span className="hidden xs:inline">marcados</span>
              </span>
            </div>
          </div>
          {selected.length > 0 && (
            <Button variant="ghost" onClick={() => setSelected([])} className="h-auto p-0 sm:p-2 text-[9px] sm:text-[10px] font-black text-primary uppercase tracking-widest hover:bg-primary/10 transition-all">
              Limpar
            </Button>
          )}
        </div>
      )}

      {/* GRID DE CARDS */}
      <div className="grid grid-cols-1 gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <div key={item.id} onClick={() => toggleSelect(item.id)} className="group relative">
            <Card className={cn(
              "relative transition-all duration-500 rounded-[2rem] sm:rounded-[2.5rem] p-4 sm:p-6 border-2 h-full flex flex-col",
              isAdmin && "cursor-pointer",
              selected.includes(item.id) 
                ? 'border-primary bg-primary/5 shadow-2xl scale-[0.98]' 
                : 'border-transparent bg-card shadow-sm hover:border-border hover:shadow-xl'
            )}>
              
              <div className="space-y-4 flex-1 flex flex-col">
                <div className="flex justify-between items-center">
                  <div className="px-2.5 py-1 bg-destructive/10 rounded-full flex items-center gap-1.5 text-[7px] sm:text-[8px] font-black text-destructive uppercase tracking-widest">
                    <AlertCircle size={10} /> 
                    <span>Excluído: {new Date(item.deletedAt).toLocaleDateString('pt-BR')}</span>
                  </div>
                </div>

                <ServiceCard service={item} />

                {isAdmin && (
                  <div className="flex gap-2 mt-auto pt-4 border-t border-border">
                    <Button 
                      disabled={isProcessing}
                      onClick={(e) => { e.stopPropagation(); handleAction("restore", [item.id]); }}
                      variant="ghost"
                      className="flex-1 h-9 sm:h-10 text-[9px] sm:text-[10px] uppercase tracking-widest text-primary hover:bg-primary/10 font-black gap-2 rounded-xl sm:rounded-2xl transition-all"
                    >
                      <RotateCcw className="h-3.5 w-3.5 sm:h-4 sm:w-4" /> Restaurar
                    </Button>
                    <Button 
                      disabled={isProcessing}
                      onClick={(e) => { e.stopPropagation(); handleAction("delete", [item.id]); }}
                      variant="ghost"
                      className="h-9 sm:h-10 px-3 sm:px-4 rounded-xl sm:rounded-2xl text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all"
                    >
                      <Trash2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    </Button>
                  </div>
                )}
              </div>

              {selected.includes(item.id) && (
                <div className="absolute -top-1 -right-1 bg-primary text-primary-foreground rounded-full p-1 shadow-lg ring-2 ring-background animate-in zoom-in">
                  <Check className="h-3 w-3 sm:h-4 sm:w-4 stroke-[4px]" />
                </div>
              )}
            </Card>
          </div>
        ))}
      </div>

      {/* EMPTY STATE */}
      {items.length === 0 && (
        <div className="py-20 sm:py-32 text-center bg-card rounded-[2rem] sm:rounded-[3rem] border-2 border-dashed border-border transition-all">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-muted/50 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 opacity-30">
            <Inbox className="w-8 h-8 sm:w-10 sm:h-10" />
          </div>
          <h3 className="text-lg sm:text-xl font-black text-foreground uppercase tracking-tight">Tudo Limpo</h3>
          <p className="text-muted-foreground text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] mt-2">Sua logística de dados está em dia</p>
        </div>
      )}

      {/* DOCK DE AÇÕES EM LOTE - VERSÃO MOBILE OPTIMIZED */}
      {isAdmin && selected.length > 0 && (
        <div className="fixed bottom-4 sm:bottom-10 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 sm:gap-8 bg-background/95 backdrop-blur-md border-2 border-primary px-3 sm:px-8 py-3 sm:py-5 rounded-2xl sm:rounded-[2.5rem] shadow-2xl animate-in fade-in slide-in-from-bottom-10 duration-500 w-[92%] sm:w-auto">
          
          <div className="flex items-center gap-2 sm:gap-4 pr-3 sm:pr-8 border-r border-border">
            <div className="h-10 w-10 sm:h-12 sm:w-12 bg-primary text-primary-foreground rounded-xl sm:rounded-2xl flex items-center justify-center font-black text-sm sm:text-lg rotate-2 shadow-lg">
              {isProcessing ? <Loader2 className="h-5 w-5 animate-spin" /> : selected.length}
            </div>
            <div className="hidden xs:block">
              <p className="text-[8px] sm:text-[10px] font-black text-foreground uppercase tracking-widest leading-none mb-1">Limbo</p>
              <p className="text-[8px] sm:text-[10px] font-black text-muted-foreground uppercase leading-none">Itens</p>
            </div>
          </div>
          
          <div className="flex flex-1 sm:flex-none gap-2 sm:gap-4">
            <Button 
              disabled={isProcessing}
              onClick={() => handleAction("restore")} 
              className="flex-1 sm:flex-none bg-primary hover:bg-primary/90 text-primary-foreground font-black rounded-xl sm:rounded-2xl flex gap-2 h-10 sm:h-12 px-4 sm:px-8 text-[10px] sm:text-xs uppercase tracking-widest transition-all active:scale-95"
            >
              <RotateCcw className="h-3.5 w-3.5 sm:h-4 sm:w-4" /> 
              <span>Restaurar</span>
            </Button>
            <Button 
              disabled={isProcessing}
              onClick={() => handleAction("delete")} 
              variant="ghost"
              className="sm:flex-none text-destructive hover:bg-destructive/10 font-black rounded-xl sm:rounded-2xl flex gap-2 h-10 sm:h-12 px-3 sm:px-6 text-[10px] sm:text-xs uppercase tracking-widest transition-all"
            >
              <Trash2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              <span className="hidden xs:inline">Apagar</span>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}