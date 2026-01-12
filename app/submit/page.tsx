"use client";
import * as React from "react";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import Header from "../../components/header";

export default function SubmitPage() {
  const [form, setForm] = React.useState({
    name: "",
    category: "",
    whatsapp: "",
    instagram: "",
    tiktok: "",
    email: "",
    site: "",
  });
  const [imageFile, setImageFile] = React.useState<File | null>(null);
  const [status, setStatus] = React.useState<string | null>(null);

  // Converte o arquivo de imagem para string base64 para o banco de dados
  const toBase64 = (file: File) => new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");

    try {
      let b64Image = "";
      if (imageFile) {
        b64Image = await toBase64(imageFile);
      }

      const res = await fetch("/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, image: b64Image }),
      });

      if (res.ok) setStatus("submitted");
      else setStatus("error");
    } catch (err) {
      setStatus("error");
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Header />
      <main className="mx-auto max-w-3xl p-6">
        <h2 className="text-2xl font-semibold">Cadastre seu negócio</h2>
        <form onSubmit={submit} className="mt-6 grid gap-4">
          <Input placeholder="Nome do negócio" required value={form.name} 
            onChange={(e) => setForm({ ...form, name: e.target.value })} />
          
          <div className="space-y-1">
            <label className="text-sm font-medium">Foto do estabelecimento</label>
            <Input type="file" accept="image/*" 
              onChange={(e) => setImageFile(e.target.files?.[0] || null)} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Input placeholder="Categoria" value={form.category} 
              onChange={(e) => setForm({ ...form, category: e.target.value })} />
            <Input placeholder="Whatsapp URL" value={form.whatsapp} 
              onChange={(e) => setForm({ ...form, whatsapp: e.target.value })} />
            <Input placeholder="Instagram URL" value={form.instagram} 
              onChange={(e) => setForm({ ...form, instagram: e.target.value })} />
            <Input placeholder="E-mail" type="email" value={form.email} 
              onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </div>

          <div className="flex items-center gap-2 mt-4">
            <Button type="submit">Enviar para aprovação</Button>
            {status === "loading" && <span className="animate-pulse">Processando...</span>}
            {status === "submitted" && <span className="text-green-600 font-bold">Enviado com sucesso!</span>}
          </div>
        </form>
      </main>
    </div>
  );
}