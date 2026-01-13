"use client";
import * as React from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { restoreServicesBatchAction, deleteServicesBatchAction } from "@/app/provider/actions";
import { Trash2, RotateCcw, AlertCircle, Loader2, Check } from "lucide-react";
import Image from "next/image";
import Swal from 'sweetalert2';

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

interface TrashListProps {
  items: any[];
  onRefresh: () => Promise<void>;
}

export default function TrashList({ items, onRefresh }: TrashListProps) {
  const [selected, setSelected] = React.useState<number[]>([]);
  const [isProcessing, setIsProcessing] = React.useState(false);

  const toggleSelect = (id: number) => {
    if (isProcessing) return;
    setSelected(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const toggleAll = () => {
    if (isProcessing) return;
    setSelected(selected.length === items.length ? [] : items.map(i => i.id));
  };

  const handleAction = async (type: "restore" | "delete") => {
    const isRestore = type === "restore";
    const count = selected.length;

    const result = await Swal.fire({
      title: isRestore ? 'Restaurar Itens?' : 'Eliminar Permanente?',
      text: isRestore 
        ? `Deseja retornar ${count} cadastros para a lista ativa?` 
        : `Atenção: ${count} itens serão apagados para sempre do sistema.`,
      icon: isRestore ? 'question' : 'warning',
      showCancelButton: true,
      confirmButtonColor: isRestore ? '#2563eb' : '#ef4444',
      cancelButtonColor: '#94a3b8',
      confirmButtonText: isRestore ? 'Sim, Restaurar' : 'Sim, Apagar Tudo',
      cancelButtonText: 'Cancelar',
      customClass: {
        popup: 'rounded-[2.5rem] p-8 bg-card text-foreground',
        confirmButton: 'rounded-xl font-black uppercase text-xs tracking-widest px-8 py-4',
        cancelButton: 'rounded-xl font-bold px-8 py-4'
      }
    });

    if (result.isConfirmed) {
      setIsProcessing(true);
      
      Swal.fire({
        title: 'Sincronizando...',
        didOpen: () => { Swal.showLoading(); },
        allowOutsideClick: false,
        customClass: { popup: 'rounded-[2.5rem] bg-card text-foreground' }
      });

      try {
        const res = isRestore 
          ? await restoreServicesBatchAction(selected) 
          : await deleteServicesBatchAction(selected);
        
        if (res.success) {
          await onRefresh();
          setSelected([]);
          
          Toast.fire({
            icon: 'success',
            title: isRestore ? 'Restaurados com sucesso!' : 'Eliminados do banco!'
          });
        } else {
          throw new Error();
        }
      } catch (error) {
        Toast.fire({
          icon: 'error',
          title: 'Erro na sincronização',
          text: 'Tente novamente em instantes.'
        });
      } finally {
        setIsProcessing(false);
        Swal.close();
      }
    }
  };

  return (
    <div className={`relative transition-all duration-500 ${isProcessing ? 'opacity-60 pointer-events-none' : ''}`}>
      
      {/* BARRA DE AÇÕES FLUTUANTE (Branca no Light / Adaptada no Dark) */}
      {selected.length > 0 && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex items-center gap-6 bg-background border-2 border-primary px-8 py-4 rounded-full shadow-[0_20px_40px_rgba(0,0,0,0.15)] animate-in fade-in slide-in-from-bottom-8 duration-300">
          <div className="flex items-center gap-4 pr-6 border-r border-border">
            <div className="h-10 w-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-black text-sm shadow-lg shadow-primary/20">
              {isProcessing ? <Loader2 className="h-5 w-5 animate-spin" /> : selected.length}
            </div>
            <div>
              <p className="text-[10px] font-black text-foreground uppercase tracking-widest leading-none mb-1">Itens</p>
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest leading-none">
                {isProcessing ? "Sincronizando" : "Selecionados"}
              </p>
            </div>
          </div>
          
          <div className="flex gap-3">
            <Button 
              onClick={() => handleAction("restore")} 
              disabled={isProcessing}
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-black rounded-full flex gap-2 h-10 px-6 text-[11px] uppercase tracking-wider transition-all active:scale-95 shadow-lg shadow-primary/20"
            >
              <RotateCcw className="h-4 w-4" /> Restaurar Seleção
            </Button>
            <Button 
              onClick={() => handleAction("delete")} 
              disabled={isProcessing}
              variant="ghost" 
              className="text-destructive hover:bg-destructive/10 font-black rounded-full flex gap-2 h-10 px-6 text-[11px] uppercase tracking-wider transition-all active:scale-95"
            >
              <Trash2 className="h-4 w-4" /> Eliminar Tudo
            </Button>
          </div>
        </div>
      )}

      {/* TABELA PADRONIZADA PARA DARK MODE */}
      <div className="bg-card rounded-[2.5rem] border border-border shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-muted/50 border-b border-border">
            <tr className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
              <th className="p-8 w-14">
                <Checkbox 
                  checked={selected.length === items.length && items.length > 0} 
                  onCheckedChange={toggleAll}
                  disabled={isProcessing}
                  className="rounded-md border-input data-[state=checked]:bg-primary"
                />
              </th>
              <th className="p-8">Negócio / Serviço</th>
              <th className="p-8 text-center">Data de Exclusão</th>
              <th className="p-8 text-right">Ações Rápidas</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {items.map((item) => (
              <tr key={item.id} className={`group transition-all duration-300 ${selected.includes(item.id) ? 'bg-primary/5' : 'hover:bg-muted/30'}`}>
                <td className="p-8">
                  <Checkbox 
                    checked={selected.includes(item.id)} 
                    onCheckedChange={() => toggleSelect(item.id)}
                    disabled={isProcessing}
                    className="rounded-md border-input data-[state=checked]:bg-primary"
                  />
                </td>
                <td className="p-8">
                  <div className="flex items-center gap-5">
                    <div className="h-14 w-14 relative rounded-2xl overflow-hidden bg-muted border border-border flex-shrink-0 shadow-inner">
                      {item.image ? (
                        <Image src={item.image} alt="" fill className="object-cover" />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center text-2xl grayscale opacity-30">🏢</div>
                      )}
                    </div>
                    <div>
                      <p className="font-black text-foreground text-base tracking-tight leading-none mb-1">{item.name}</p>
                      <p className="text-[10px] font-black text-primary uppercase tracking-widest bg-primary/10 px-2 py-0.5 rounded inline-block">
                        {item.category}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="p-8 text-center">
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-destructive/10 rounded-full text-[11px] font-black text-destructive uppercase tracking-tighter">
                    <AlertCircle className="h-3 w-3" />
                    {item.deletedAt ? new Date(item.deletedAt).toLocaleDateString('pt-BR') : 'Data Indisponível'}
                  </div>
                </td>
                <td className="p-8">
                  <div className="flex justify-end gap-3">
                    <Button 
                      disabled={isProcessing}
                      onClick={() => { setSelected([item.id]); handleAction("restore"); }} 
                      variant="outline" 
                      className="h-10 w-10 p-0 rounded-xl border-border text-primary hover:bg-primary/10"
                    >
                      <RotateCcw className="h-4 w-4" />
                    </Button>
                    <Button 
                      disabled={isProcessing}
                      onClick={() => { setSelected([item.id]); handleAction("delete"); }} 
                      variant="outline" 
                      className="h-10 w-10 p-0 rounded-xl border-border text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {items.length === 0 && (
          <div className="py-32 text-center">
            <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-4xl grayscale opacity-30">♻️</span>
            </div>
            <p className="text-muted-foreground font-black uppercase tracking-[0.3em] text-xs">Lixeira Vazia</p>
          </div>
        )}
      </div>
    </div>
  );
}