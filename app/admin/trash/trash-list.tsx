"use client";
import * as React from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { restoreServicesBatchAction, deleteServicesBatchAction } from "@/app/provider/actions";
import { Trash2, RotateCcw, AlertCircle, Check } from "lucide-react";
import Image from "next/image";
import Swal from 'sweetalert2';

export default function TrashList({ items }: { items: any[] }) {
  const [selected, setSelected] = React.useState<number[]>([]);

  const toggleSelect = (id: number) => {
    setSelected(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const toggleAll = () => {
    setSelected(selected.length === items.length ? [] : items.map(i => i.id));
  };

  // Funções de ação com SweetAlert2 padronizado
  const handleBatchRestore = async () => {
    const result = await Swal.fire({
      title: 'Restaurar Itens?',
      text: `Deseja retornar ${selected.length} cadastros para a lista ativa?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#2563eb',
      cancelButtonColor: '#94a3b8',
      confirmButtonText: 'Sim, Restaurar',
      cancelButtonText: 'Cancelar',
      customClass: { popup: 'rounded-[2rem] border-none shadow-2xl', title: 'font-black tracking-tight' }
    });

    if (result.isConfirmed) {
      const res = await restoreServicesBatchAction(selected);
      if (res.success) {
        Swal.fire({ icon: 'success', title: 'Restaurados!', showConfirmButton: false, timer: 1500 });
        setSelected([]);
      }
    }
  };

  const handleBatchDelete = async () => {
    const result = await Swal.fire({
      title: 'Eliminar Permanente?',
      text: `Atenção: ${selected.length} itens serão apagados para sempre.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#94a3b8',
      confirmButtonText: 'Sim, Apagar Tudo',
      cancelButtonText: 'Cancelar',
      customClass: { popup: 'rounded-[2rem] border-none shadow-2xl', title: 'font-black tracking-tight' }
    });

    if (result.isConfirmed) {
      const res = await deleteServicesBatchAction(selected);
      if (res.success) {
        Swal.fire('Eliminados!', 'Os registros foram removidos do banco.', 'success');
        setSelected([]);
      }
    }
  };

  return (
    <div className="relative">
      {/* BARRA DE AÇÕES FLUTUANTE - Sólida e com Borda Azul */}
      {selected.length > 0 && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex items-center gap-6 bg-white border-2 border-blue-600 px-8 py-4 rounded-full shadow-[0_20px_40px_rgba(0,0,0,0.15)] animate-in fade-in slide-in-from-bottom-8 duration-300">
          <div className="flex items-center gap-4 pr-6 border-r border-slate-100">
            <div className="h-10 w-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-black text-sm">
              {selected.length}
            </div>
            <p className="text-[10px] font-black text-slate-900 uppercase tracking-widest leading-none">
              Itens<br/>Selecionados
            </p>
          </div>
          
          <div className="flex gap-3">
            <Button onClick={handleBatchRestore} className="bg-blue-600 hover:bg-blue-700 text-white font-black rounded-full flex gap-2 h-10 px-6 text-[11px] uppercase tracking-wider transition-all active:scale-95 shadow-lg shadow-blue-200">
              <RotateCcw className="h-4 w-4" /> Restaurar Seleção
            </Button>
            <Button onClick={handleBatchDelete} variant="ghost" className="text-red-500 hover:bg-red-50 hover:text-red-600 font-black rounded-full flex gap-2 h-10 px-6 text-[11px] uppercase tracking-wider transition-all active:scale-95">
              <Trash2 className="h-4 w-4" /> Eliminar Tudo
            </Button>
          </div>
        </div>
      )}

      {/* TABELA PADRONIZADA */}
      <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-white border-b border-slate-100">
            <tr className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
              <th className="p-6 w-14">
                <Checkbox 
                  checked={selected.length === items.length && items.length > 0} 
                  onCheckedChange={toggleAll}
                  className="rounded-md border-slate-300 data-[state=checked]:bg-blue-600 shadow-none"
                />
              </th>
              <th className="p-6">Negócio</th>
              <th className="p-6 text-center">Data de Exclusão</th>
              <th className="p-6 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {items.map((item) => (
              <tr key={item.id} className={`group transition-all ${selected.includes(item.id) ? 'bg-blue-50/40' : 'hover:bg-slate-50/30'}`}>
                <td className="p-6">
                  <Checkbox 
                    checked={selected.includes(item.id)} 
                    onCheckedChange={() => toggleSelect(item.id)}
                    className="rounded-md border-slate-300 data-[state=checked]:bg-blue-600"
                  />
                </td>
                <td className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 relative rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 flex-shrink-0">
                      {item.image ? (
                        <Image src={item.image} alt="" fill className="object-cover" />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center text-xl opacity-30">🏢</div>
                      )}
                    </div>
                    <div>
                      <p className="font-black text-slate-800 text-sm tracking-tight">{item.name}</p>
                      <p className="text-[10px] font-black text-blue-600 uppercase tracking-tighter bg-blue-50 px-2 py-0.5 rounded inline-block mt-1">
                        {item.category}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="p-6 text-center">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-100 rounded-full text-[11px] font-bold text-slate-500">
                    <AlertCircle className="h-3 w-3 text-red-400" />
                    {new Date(item.deletedAt).toLocaleDateString('pt-BR')}
                  </div>
                </td>
                <td className="p-6">
                  <div className="flex justify-end gap-2">
                    <Button 
                      onClick={() => { setSelected([item.id]); handleBatchRestore(); }} 
                      variant="outline" 
                      className="h-9 w-9 p-0 rounded-xl border-slate-200 text-blue-600 hover:bg-blue-50 hover:border-blue-200"
                    >
                      <RotateCcw className="h-4 w-4" />
                    </Button>
                    <Button 
                      onClick={() => { setSelected([item.id]); handleBatchDelete(); }} 
                      variant="outline" 
                      className="h-9 w-9 p-0 rounded-xl border-slate-200 text-red-500 hover:bg-red-50 hover:border-red-200"
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
          <div className="py-24 text-center">
            <span className="text-5xl opacity-20">♻️</span>
            <p className="mt-4 text-slate-400 font-bold uppercase tracking-widest text-xs italic">A lixeira está vazia</p>
          </div>
        )}
      </div>
    </div>
  );
}