import prisma from "@/lib/prisma";
import Header from "@/components/header";
import TrashList from "./trash-list"; // Importa o componente cliente
import Link from "next/link";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { createServerClient } from '@supabase/ssr';

export default async function AdminTrashPage() {
  const cookieStore = await cookies();
  const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, { cookies: { getAll: () => cookieStore.getAll() } });
  const { data: { user } } = await supabase.auth.getUser();
  const dbUser = await prisma.user.findUnique({ where: { email: user?.email || "" } });

  if (dbUser?.role !== "ADMIN") redirect("/");

  const trashedItems = await prisma.service.findMany({
    where: { deletedAt: { not: null } },
    orderBy: { deletedAt: 'desc' }
  });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Header />
      <main className="mx-auto max-w-5xl p-6 py-12">
        <div className="mb-10">
          <Link href="/admin/dashboard" className="text-blue-600 text-[10px] font-black uppercase tracking-widest hover:underline mb-2 block">
            ← Dashboard
          </Link>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Lixeira Logística</h1>
        </div>

        <TrashList items={JSON.parse(JSON.stringify(trashedItems))} />
      </main>
    </div>
  );
}