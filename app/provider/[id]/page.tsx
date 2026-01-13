import prisma from "@/lib/prisma";
import Header from "@/components/header";
import ContactIcons from "@/components/contact-icons";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { cookies } from "next/headers";
import { createServerClient } from '@supabase/ssr';
import WhatsAppButton from "@/components/whatsapp-button";

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
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Header />
      <main className="mx-auto max-w-4xl p-6 py-12">
        <div className="flex justify-between items-center mb-6">
          <Link href="/" className="text-sm text-blue-600 hover:underline">
            &larr; Voltar para a busca
          </Link>
          
          {canEdit && (
            <Link href={isAdmin ? `/admin/provider/${id}/edit` : `/provider/edit/${id}`}>
              <Button variant="outline" className="border-blue-200 text-blue-600 font-bold">
                {isAdmin ? "⚙️ Editar como Admin" : "📝 Editar meu Negócio"}
              </Button>
            </Link>
          )}
        </div>

        <div className="bg-white rounded-2xl shadow-sm border p-8 flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-1/3 aspect-square rounded-xl bg-slate-100 overflow-hidden border">
            {service.image ? (
              <img src={service.image} alt={service.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-slate-100">
                <span className="text-6xl text-slate-300">🏢</span>
              </div>
            )}
          </div>

          <div className="flex-1 space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold uppercase">
                  {service.category}
                </span>
                {canEdit && (
                  <span className="text-xs bg-slate-100 px-2 py-1 rounded font-mono">
                    👁️ {service.views} visitas
                  </span>
                )}
              </div>
              <h1 className="text-4xl font-bold tracking-tight">{service.name}</h1>
              <p className="mt-6 text-slate-600 leading-relaxed whitespace-pre-wrap">{service.description}</p>
            </div>

            <div className="space-y-4">
              <h3 className="font-bold text-lg border-b pb-2 uppercase text-slate-400 text-[10px] tracking-widest">
                Contatos Diretos
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

            <div className="pt-4">
              {service.whatsapp && (
                <WhatsAppButton phone={service.whatsapp} providerEmail={service.email || ""} />
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}