"use client";
import * as React from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { updateServiceAction, deleteServiceAction } from "@/app/provider/actions";
import Image from "next/image";
import Swal from 'sweetalert2'; // Importação do SweetAlert2

export default function EditServiceForm({ service }: { service: any }) {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [uploading, setUploading] = React.useState(false);
  const [error, setError] = React.useState("");
  
  // Estado inicial vindo do Prisma (Preservando todos os campos e o vínculo)
  const [formData, setFormData] = React.useState({
    name: service.name || "",
    category: service.category || "",
    description: service.description || "",
    image: service.image || "",
    whatsapp: service.whatsapp || "",
    instagram: service.instagram || "",
    tiktok: service.tiktok || "",
    email: service.email || "", // Mantido no estado, mas oculto na UI
    site: service.site || "",
  });

  const [imagePreview, setImagePreview] = React.useState<string | null>(service.image);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  /**
   * Máscara de Telefone (Padrão Brasileiro)
   */
  const maskPhone = (value: string) => {
    return value
      .replace(/\D/g, "")
      .replace(/(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{5})(\d)/, "$1-$2")
      .replace(/(-\d{4})\d+?$/, "$1");
  };

  /**
   * Upload de Logotipo para o Storage com Preview Imediato
   */
  async function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      setError("");
      
      const fileExt = file.name.split('.').pop();
      const fileName = `${service.id}-${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('logos')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('logos')
        .getPublicUrl(fileName);

      setFormData({ ...formData, image: publicUrl });
      setImagePreview(publicUrl);
    } catch (err: any) {
      setError("Erro no upload: " + err.message);
    } finally {
      setUploading(false);
    }
  }

  const removeImage = () => {
    setFormData({ ...formData, image: "" });
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      const result = await updateServiceAction(service.id, formData);
      
      if (result.success) {
        // Feedback Profissional de Sucesso
        await Swal.fire({
          title: 'Sucesso!',
          text: 'As alterações foram salvas com sucesso.',
          icon: 'success',
          confirmButtonColor: '#2563eb',
          customClass: { popup: 'rounded-3xl' }
        });
        router.push(`/provider/${service.id}`);
        router.refresh();
      } else {
        setError("Não foi possível salvar as alterações.");
        setLoading(false);
      }
    } catch (err) {
      setError("Falha na comunicação com o servidor.");
      setLoading(false);
    }
  }

  /**
   * Lógica de Exclusão Segura com SweetAlert2
   */
  async function handleDelete() {
    const result = await Swal.fire({
      title: 'Tem certeza?',
      text: "Você deseja excluir permanentemente este cadastro? Esta ação não pode ser desfeita.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#94a3b8',
      confirmButtonText: 'Sim, excluir permanentemente',
      cancelButtonText: 'Cancelar',
      reverseButtons: true,
      customClass: {
        popup: 'rounded-3xl',
        confirmButton: 'rounded-xl font-bold py-3 px-6',
        cancelButton: 'rounded-xl font-bold py-3 px-6'
      }
    });

    if (result.isConfirmed) {
      setIsDeleting(true);
      setError("");
      try {
        const result = await deleteServiceAction(service.id);
        if (result.success) {
          await Swal.fire({
            title: 'Excluído!',
            text: 'O cadastro foi removido do sistema.',
            icon: 'success',
            confirmButtonColor: '#2563eb',
            customClass: { popup: 'rounded-3xl' }
          });
          router.push("/");
          router.refresh();
        } else {
          setError("Não foi possível excluir o cadastro.");
          setIsDeleting(false);
        }
      } catch (err) {
        setError("Erro ao processar a exclusão.");
        setIsDeleting(false);
      }
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 text-red-700 text-xs font-bold rounded-lg animate-in fade-in">
          ⚠️ {error}
        </div>
      )}

      {/* Upload de Imagem - Réplica exata do cadastro */}
      <div className="grid gap-2">
        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1 mb-1 block">Logotipo ou Foto de Capa</label>
        <input 
          type="file" 
          id="image-upload" 
          accept="image/*" 
          onChange={handleImageChange} 
          className="hidden"
          ref={fileInputRef}
          disabled={uploading || isDeleting}
        />

        {!imagePreview ? (
          <label 
            htmlFor="image-upload" 
            className="group flex flex-col items-center justify-center w-full h-40 border-3 border-dashed border-slate-200 rounded-2xl cursor-pointer bg-slate-50/50 hover:bg-blue-50 hover:border-blue-300 transition-all duration-300"
          >
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <div className="p-3 bg-white rounded-full shadow-sm mb-3 group-hover:scale-110 transition-transform">
                <svg className="w-8 h-8 text-blue-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 1.6 10.5A3.3 3.3 0 0 0 5 13h3m2-2v4m0 0l-2-2m2 2l2-2"/>
                </svg>
              </div>
              <p className="mb-1 text-sm text-slate-500 group-hover:text-blue-600 font-bold">Clique para enviar</p>
              <p className="text-xs text-slate-400">PNG, JPG ou GIF (Recomendado: quadrado)</p>
            </div>
          </label>
        ) : (
          <div className="relative w-full h-48 rounded-2xl overflow-hidden border-2 border-slate-200 group">
            <Image src={imagePreview} alt="Preview" fill className="object-cover transition-opacity group-hover:opacity-90" />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
              <label htmlFor="image-upload" className="cursor-pointer bg-white/90 hover:bg-white text-slate-700 font-bold px-4 py-2 rounded-full text-sm shadow-sm transition-transform hover:scale-105">
                Trocar foto
              </label>
              <button type="button" onClick={removeImage} className="bg-red-500/90 hover:bg-red-600 text-white font-bold px-4 py-2 rounded-full text-sm shadow-sm transition-transform hover:scale-105">
                Remover
              </button>
            </div>
            {(uploading || isDeleting) && (
              <div className="absolute inset-0 bg-white/80 flex items-center justify-center transition-all">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="grid gap-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="grid gap-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Nome do negócio *</label>
            <Input required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="h-12 rounded-xl border-slate-200 bg-slate-50/50 focus:bg-white transition-all" placeholder="Ex: Consultoria Silva" />
          </div>

          <div className="grid gap-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Categoria *</label>
            <Input required value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} className="h-12 rounded-xl border-slate-200 bg-slate-50/50 focus:bg-white transition-all" placeholder="Ex: Tecnologia, Artesanato..." />
          </div>
        </div>

        <div className="grid gap-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Descrição detalhada *</label>
          <textarea 
            className="w-full min-h-[160px] rounded-2xl border-0 bg-slate-100/80 p-5 text-sm text-slate-700 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none shadow-inner"
            required
            placeholder="Conte sua história, seus diferenciais e o que você oferece. Capriche nos detalhes para atrair clientes!"
            value={formData.description} 
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">WhatsApp de Contato</label>
            <Input 
              placeholder="(00) 00000-0000" 
              value={formData.whatsapp} 
              onChange={(e) => setFormData({ ...formData, whatsapp: maskPhone(e.target.value) })}
              className="h-12 rounded-xl font-mono border-slate-200 bg-slate-50/50 focus:bg-white transition-all"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Instagram (@usuario)</label>
            <Input 
              placeholder="@seu.negocio" 
              value={formData.instagram} 
              onChange={(e) => setFormData({ ...formData, instagram: e.target.value })} 
              className="h-12 rounded-xl border-slate-200 bg-slate-50/50 focus:bg-white transition-all" 
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">TikTok</label>
            <Input 
              placeholder="@seu.tiktok" 
              value={formData.tiktok} 
              onChange={(e) => setFormData({ ...formData, tiktok: e.target.value })} 
              className="h-12 rounded-xl border-slate-200 bg-slate-50/50 focus:bg-white transition-all" 
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Site Oficial</label>
            <Input 
              placeholder="https://..." 
              value={formData.site} 
              onChange={(e) => setFormData({ ...formData, site: e.target.value })} 
              className="h-12 rounded-xl border-slate-200 bg-slate-50/50 focus:bg-white transition-all" 
            />
          </div>
        </div>
      </div>

      <div className="pt-6 flex flex-col gap-4 border-t">
        <div className="flex gap-4">
          <Button 
            type="button" 
            variant="ghost" 
            onClick={() => router.back()} 
            className="flex-1 h-14 rounded-2xl font-bold text-slate-500 hover:bg-slate-100"
            disabled={loading || isDeleting}
          >
            Cancelar
          </Button>
          <Button 
            type="submit" 
            disabled={loading || uploading || isDeleting} 
            className="flex-[2] bg-blue-600 hover:bg-blue-700 h-14 rounded-2xl font-black text-lg shadow-lg active:scale-[0.98]"
          >
            {loading ? "Salvando..." : "Confirmar Alterações"}
          </Button>
        </div>

        {/* BOTÃO DE EXCLUIR */}
        <Button 
          type="button" 
          onClick={handleDelete}
          disabled={loading || isDeleting}
          variant="outline"
          className="h-14 rounded-2xl border-red-100 text-red-500 hover:bg-red-50 hover:border-red-200 font-bold transition-all"
        >
          {isDeleting ? "Excluindo cadastro..." : "🗑️ Excluir este negócio permanentemente"}
        </Button>
      </div>
    </form>
  );
}