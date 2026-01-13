import prisma from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import Header from "@/components/header";
import EditServiceForm from "../edit-form";
import { cookies } from "next/headers";
import { createServerClient } from '@supabase/ssr';

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

  // Segurança: Só entra quem for admin ou dono
  if (!isAdmin && !isOwner) {
    redirect("/");
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <main className="mx-auto max-w-2xl p-6 py-12">
        <div className="mb-6">
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">
            Editar Prestador
          </h2>
          <p className="text-slate-500 text-sm">
            {isAdmin ? "Modo Administrador" : "Alterando seus dados de negócio"}
          </p>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
          <EditServiceForm service={service} />
        </div>
      </main>
    </div>
  );
}