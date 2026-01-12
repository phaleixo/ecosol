"use client";
import * as React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Header from "@/components/header";
import { supabase } from "@/lib/supabase";

export default function SubmitPage() {
  const [form, setForm] = React.useState({
    name: "",
    category: "",
    description: "", // Campo adicionado
    whatsapp: "",
    instagram: "",
    email: "",
  });
  const [imageFile, setImageFile] = React.useState<File | null>(null);
  const [status, setStatus] = React.useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");

    try {
      let imageUrl = "";

      // 1. UPLOAD PARA STORAGE (Melhor prática de engenharia)
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
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

      // 2. ENVIO PARA API (Salva URL e Descrição no Prisma)
      const res = await fetch("/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, image: imageUrl }),
      });

      if (res.ok) setStatus("submitted");
      else setStatus("error");
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Header />
      <main className="mx-auto max-w-3xl p-6">
        <div className="bg-white p-8 rounded-2xl shadow-sm border mt-6">
          <h2 className="text-2xl font-bold mb-6">Cadastre seu negócio</h2>
          <form onSubmit={submit} className="grid gap-5">
            <div className="grid gap-2">
              <label className="text-sm font-semibold">Nome do negócio *</label>
              <Input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>

            <div className="grid gap-2">
              <label className="text-sm font-semibold">Categoria *</label>
              <Input required value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
            </div>

            <div className="grid gap-2">
              <label className="text-sm font-semibold">Descrição detalhada *</label>
              <textarea 
                className="w-full min-h-[120px] rounded-md border border-slate-200 p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                required
                value={form.description} 
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </div>

            <div className="grid gap-2">
              <label className="text-sm font-semibold">Logotipo / Foto</label>
              <Input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] || null)} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input placeholder="WhatsApp" value={form.whatsapp} onChange={(e) => setForm({ ...form, whatsapp: e.target.value })} />
              <Input placeholder="Instagram" value={form.instagram} onChange={(e) => setForm({ ...form, instagram: e.target.value })} />
            </div>

            <Button type="submit" disabled={status === "loading"} className="mt-4 bg-blue-600">
              {status === "loading" ? "Enviando..." : "Enviar para aprovação"}
            </Button>

            {status === "submitted" && <p className="text-green-600 font-bold text-center">Cadastro enviado com sucesso!</p>}
          </form>
        </div>
      </main>
    </div>
  );
}