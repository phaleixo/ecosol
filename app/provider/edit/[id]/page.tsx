import prisma from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import Header from "@/components/header";
import EditServiceForm from "../edit-form";
import { cookies } from "next/headers";
import { createServerClient } from '@supabase/ssr';
import { Settings2, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default async function EditServicePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params; 
  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll() } }
  );

  // LOGÍSTICA DE DADOS PARALELA
  const [{ data: { user } }, service] = await Promise.all([
    supabase.auth.getUser(),
    prisma.service.findUnique({ where: { id: parseInt(id) } })
  ]);

  if (!service) return notFound();

  const dbUser = user ? await prisma.user.findUnique({
    where: { email: user.email },
    select: { role: true }
  }) : null;

  const isAdmin = dbUser?.role === "ADMIN";
  const isOwner = user?.email === service.email;

  // SEGURANÇA DE ACESSO: BLOQUEIO DE CARGA NÃO AUTORIZADA
  if (!isAdmin && !isOwner) {
    redirect("/");
  }

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300 pb-20">
      <Header />
      
      <main className="mx-auto max-w-6xl p-6 py-12 flex flex-col items-center">
        {/* NAVEGAÇÃO SUPERIOR PADRONIZADA */}
        <div className="w-full mb-10 flex justify-start">
          <Link 
            href={isAdmin ? "/admin/dashboard" : `/provider/${id}`}
            className="group inline-flex items-center gap-2 text-primary text-[10px] font-black uppercase tracking-[0.2em] hover:opacity-80 transition-all bg-primary/5 px-4 py-2.5 rounded-xl border border-primary/10"
          >
            <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
            <span>{isAdmin ? "Voltar ao Painel" : "Ver meu perfil"}</span>
          </Link>
        </div>

        {/* HEADER DA PÁGINA: ICONBOX PADRONIZADO CENTRALIZADO */}
        <section className="w-full flex flex-col items-center mb-12 gap-5 text-center">
          <div className="p-4 bg-primary/10 rounded-3xl text-primary shadow-inner">
            <Settings2 size={32} />
          </div>
          <div>
            <h2 className="text-3xl font-black tracking-tighter text-foreground uppercase leading-none">
              Editar Cadastro
            </h2>
            <p className="text-muted-foreground font-medium mt-1 uppercase text-[10px] tracking-widest">
              {isAdmin ? "🔧 Modo Administrador / Auditoria" : "👤 Atualizando Dados do Empreendedor"}
            </p>
          </div>
        </section>

        {/* CARD DO FORMULÁRIO CENTRALIZADO */}
        <div className="w-full max-w-2xl">
          <div className="bg-card p-8 md:p-10 rounded-[2.5rem] shadow-xl border border-border animate-in fade-in slide-in-from-bottom-4 duration-500">
            <EditServiceForm service={service} />
          </div>
        </div>
      </main>
    </div>
  );
}