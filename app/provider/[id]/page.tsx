import prisma from "@/lib/prisma";
import Header from "@/components/header";
import ContactIcons from "@/components/contact-icons";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { cookies } from "next/headers";
import { createServerClient } from '@supabase/ssr';
import WhatsAppButton from "@/components/whatsapp-button";
import { ArrowLeft, Settings, Eye } from "lucide-react";

export default async function ProviderPage({
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
  const canEdit = isAdmin || isOwner;

  if (!service.approved && !canEdit) return notFound();

  if (service.approved && !canEdit) {
    await prisma.service.update({
      where: { id: parseInt(id) },
      data: { views: { increment: 1 } }
    });
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-12">
      <Header />
      
      <main className="mx-auto max-w-4xl px-4 py-6 md:py-8">
        {/* 1. Navegação de Topo Compacta */}
        <div className="flex justify-between items-center mb-4 px-2">
          <Link href="/" className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-blue-600 transition-colors">
            <ArrowLeft className="h-3 w-3" /> Voltar para a busca
          </Link>
          
          {canEdit && (
            <Link href={isAdmin ? `/admin/provider/${id}/edit` : `/provider/edit/${id}`}>
              <Button variant="outline" className="h-8 border-blue-100 text-blue-600 font-black text-[9px] uppercase tracking-widest rounded-xl hover:bg-blue-50 transition-all flex gap-2">
                <Settings className="h-3.5 w-3.5" />
                {isAdmin ? "Admin Edit" : "Editar Negócio"}
              </Button>
            </Link>
          )}
        </div>

        {/* 2. Card Principal: Arredondamento 2.5rem unificado */}
        <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 p-4 md:p-8 flex flex-col md:flex-row gap-6 md:gap-10">
          
          {/* Imagem: Quadrada e compacta no desktop */}
          <div className="w-full md:w-2/5 aspect-square rounded-[2rem] bg-slate-50 overflow-hidden border border-slate-50 shadow-inner">
            {service.image ? (
              <img src={service.image} alt={service.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-slate-50">
                <span className="text-6xl grayscale opacity-20">🏢</span>
              </div>
            )}
          </div>

          {/* Conteúdo: Hierarquia Visual de Engenharia */}
          <div className="flex-1 flex flex-col">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-[8px] font-black text-blue-600 uppercase tracking-[0.25em] px-3 py-1 bg-blue-50 rounded-full">
                {service.category}
              </span>
              {canEdit && (
                <span className="flex items-center gap-1.5 text-[9px] font-bold text-slate-400 bg-slate-50 px-2.5 py-1 rounded-full border border-slate-100">
                  <Eye className="h-3 w-3" /> {service.views} visitas
                </span>
              )}
            </div>

            <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tighter uppercase leading-none mb-4">
              {service.name}
            </h1>

            <p className="text-sm md:text-base text-slate-500 leading-relaxed font-medium whitespace-pre-wrap mb-8">
              {service.description}
            </p>

            <div className="mt-auto space-y-6">
              {/* Contatos com os novos ícones visuais */}
              <div className="space-y-3">
                <h3 className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-300">
                  Canais de Atendimento
                </h3>
                <ContactIcons 
                  contacts={{
                    whatsapp: service.whatsapp ?? undefined,
                    instagram: service.instagram ?? undefined,
                    tiktok: service.tiktok ?? undefined,
                    email: service.email ?? undefined,
                    site: service.site ?? undefined,
                  }} 
                />
              </div>

              <div className="pt-2">
                {service.whatsapp && (
                  <WhatsAppButton phone={service.whatsapp} providerEmail={service.email || ""} />
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}