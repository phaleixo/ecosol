"use client";
import * as React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Header from "@/components/header";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Swal from 'sweetalert2'; // Integração do SweetAlert2 para mensagens bonitas

export default function SubmitPage() {
  const router = useRouter();
  const [userEmail, setUserEmail] = React.useState<string | null>(null);
  
  // Estado completo padronizado com o EditForm
  const [form, setForm] = React.useState({
    name: "",
    category: "",
    description: "",
    whatsapp: "",
    instagram: "",
    tiktok: "", // Campo preservado para padronização
    site: "",   // Campo preservado para padronização
  });
  
  const [imageFile, setImageFile] = React.useState<File | null>(null);
  const [imagePreview, setImagePreview] = React.useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [status, setStatus] = React.useState<string | null>(null);

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

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const maskedValue = maskPhone(e.target.value);
    setForm({ ...form, whatsapp: maskedValue });
  };

  /**
   * Lógica de Seleção de Imagem com Preview
   */
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Limpeza de memória do preview quando o componente desmonta
  React.useEffect(() => {
    return () => {
      if (imagePreview) URL.revokeObjectURL(imagePreview);
    };
  }, [imagePreview]);

  // Captura da Sessão do Usuário
  React.useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push("/login");
        return;
      }
      setUserEmail(session.user.email || null);
    };
    getSession();
  }, [router]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!userEmail) return setStatus("error");
    
    setStatus("loading");

    try {
      let imageUrl = "";

      // Upload para o Bucket 'logos' no Supabase Storage
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${crypto.randomUUID()}.${fileExt}`;
        const filePath = `logos/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('logos')
          .upload(filePath, imageFile);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('logos')
          .getPublicUrl(filePath);
        
        imageUrl = publicUrl;
      }

      // Envio completo para a API (Vínculo silencioso via email preservado)
      const res = await fetch("/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          ...form, 
          image: imageUrl,
          email: userEmail
        }),
      });

      if (res.ok) {
        setStatus("submitted");
        // MessageBox bonitinha com SweetAlert2
        await Swal.fire({
          title: 'Sucesso!',
          text: 'Seu negócio foi cadastrado e enviado para aprovação.',
          icon: 'success',
          confirmButtonColor: '#2563eb',
          customClass: { popup: 'rounded-3xl' }
        });
        router.push("/"); // Redireciona para a home após o sucesso
      } else {
        setStatus("error");
      }
    } catch (err) {
      console.error("Erro no envio:", err);
      setStatus("error");
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Header />
      <main className="mx-auto max-w-3xl p-6 py-12">
        <div className="bg-white p-8 rounded-3xl shadow-xl shadow-slate-100 border border-slate-100 mt-6">
          <div className="mb-8 text-center sm:text-left">
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Cadastre seu negócio</h2>
            <p className="text-sm text-slate-500 mt-1">
              Preencha os dados para divulgar seu serviço na rede Ecosol.
            </p>
          </div>

          <form onSubmit={submit} className="grid gap-8">
            {/* 1. Upload de Imagem - Réplica exata do layout de Edição */}
            <div className="grid gap-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1 mb-1 block">Logotipo ou Foto de Capa</label>
              <input 
                type="file" 
                id="image-upload" 
                accept="image/*" 
                onChange={handleImageChange} 
                className="hidden"
                ref={fileInputRef}
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
                </div>
              )}
            </div>

            {/* 2. Informações Básicas - Posição Idêntica ao Edit */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Nome do negócio *</label>
                <Input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="h-12 rounded-xl border-slate-200 bg-slate-50/50 focus:bg-white transition-all" placeholder="Ex: Consultoria Silva" />
              </div>

              <div className="grid gap-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Categoria *</label>
                <Input required value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="h-12 rounded-xl border-slate-200 bg-slate-50/50 focus:bg-white transition-all" placeholder="Ex: Tecnologia, Artesanato..." />
              </div>
            </div>

            {/* 3. Descrição Detalhada - Posição Idêntica ao Edit */}
            <div className="grid gap-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Descrição detalhada *</label>
              <textarea 
                className="w-full min-h-[160px] rounded-2xl border-0 bg-slate-100/80 p-5 text-sm text-slate-700 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none shadow-inner"
                required
                placeholder="Conte sua história, seus diferenciais e o que você oferece. Capriche nos detalhes para atrair clientes!"
                value={form.description} 
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </div>

            {/* 4. Grade de Contatos e Redes Sociais - Posição Idêntica ao Edit */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">WhatsApp de Contato</label>
                <Input 
                  placeholder="(00) 00000-0000" 
                  value={form.whatsapp} 
                  onChange={handlePhoneChange}
                  className="h-12 rounded-xl font-mono border-slate-200 bg-slate-50/50 focus:bg-white transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Instagram (@usuario)</label>
                <Input placeholder="@seu.negocio" value={form.instagram} onChange={(e) => setForm({ ...form, instagram: e.target.value })} className="h-12 rounded-xl border-slate-200 bg-slate-50/50 focus:bg-white transition-all" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">TikTok (@seu.tiktok)</label>
                <Input placeholder="@seu.tiktok" value={form.tiktok} onChange={(e) => setForm({ ...form, tiktok: e.target.value })} className="h-12 rounded-xl border-slate-200 bg-slate-50/50 focus:bg-white transition-all" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Site Oficial</label>
                <Input placeholder="https://..." value={form.site} onChange={(e) => setForm({ ...form, site: e.target.value })} className="h-12 rounded-xl border-slate-200 bg-slate-50/50 focus:bg-white transition-all" />
              </div>
            </div>

            {/* Botão de Submissão Profissional */}
            <Button 
              type="submit" 
              disabled={status === "loading" || !userEmail} 
              className="mt-6 bg-blue-600 hover:bg-blue-700 h-14 rounded-2xl font-black text-lg shadow-lg shadow-blue-200/50 transition-all active:scale-[0.98]"
            >
              {status === "loading" ? (
                <div className="flex items-center gap-2">
                  <div className="h-5 w-5 animate-spin rounded-full border-b-2 border-white"></div>
                  <span>Processando envio...</span>
                </div>
              ) : "Enviar para Aprovação"}
            </Button>

            {/* Feedback de Erro Preservado */}
            {status === "error" && (
              <div className="p-4 bg-red-50 border border-red-100 rounded-2xl text-center">
                <p className="text-red-600 font-bold text-sm">⚠️ Ocorreu um erro no envio. Verifique os dados e tente novamente.</p>
              </div>
            )}
          </form>
        </div>
      </main>
    </div>
  );
}