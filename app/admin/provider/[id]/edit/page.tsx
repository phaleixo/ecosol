import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import Header from "@/components/header";
import EditServiceForm from "@/app/provider/edit/edit-form";
import { Settings2, ArrowLeft, ShieldCheck } from "lucide-react";
import Link from "next/link";

export default async function AdminEditServicePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  
  const service = await prisma.service.findUnique({
    where: { id: parseInt(id) },
  });

  if (!service) return notFound();

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300 pb-20">
      <Header />
      
      <main className="mx-auto max-w-6xl p-6 py-12 flex flex-col items-center">
        {/* NAVEGAÇÃO SUPERIOR PADRONIZADA */}
        <div className="w-full mb-10 flex justify-start">
          <Link 
            href="/admin/dashboard"
            className="group inline-flex items-center gap-2 text-primary text-[10px] font-black uppercase tracking-[0.2em] hover:opacity-80 transition-all bg-primary/5 px-4 py-2.5 rounded-xl border border-primary/10"
          >
            <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
            <span>Voltar ao Painel Admin</span>
          </Link>
        </div>

        {/* HEADER DA PÁGINA: ICONBOX PADRONIZADO CENTRALIZADO */}
        <section className="w-full flex flex-col items-center mb-12 gap-5 text-center">
          <div className="p-4 bg-primary/10 rounded-3xl text-primary shadow-inner">
            <Settings2 size={32} />
          </div>
          <div>
            <div className="flex items-center justify-center gap-3 mb-1">
               <h2 className="text-3xl font-black text-foreground tracking-tighter uppercase leading-none">
                Editar Cadastro
              </h2>
              <span className="bg-primary/10 text-primary text-[8px] font-black px-2 py-0.5 rounded-full border border-primary/20 uppercase">
                Admin
              </span>
            </div>
            <p className="text-muted-foreground text-[10px] font-black uppercase tracking-widest">
              Auditando: <span className="text-foreground">{service.name}</span>
            </p>
          </div>
        </section>

        {/* CARD CENTRALIZADO */}
        <div className="w-full max-w-2xl">
          <div className="bg-card p-8 md:p-10 rounded-[2.5rem] shadow-xl border border-border animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="mb-8 pb-4 border-b border-border flex items-center gap-2 text-primary">
              <ShieldCheck size={16} />
              <span className="text-[10px] font-black uppercase tracking-widest">Controle de Segurança Ativo</span>
            </div>
            
            <EditServiceForm service={service} />
          </div>
        </div>
      </main>
    </div>
  );
}