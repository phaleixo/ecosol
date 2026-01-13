"use server";
import prisma from "@/lib/prisma";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

export async function updateServiceAction(id: number, formData: any) {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll() } }
  );

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Não autenticado");

  const [dbUser, service] = await Promise.all([
    prisma.user.findUnique({ where: { email: user.email! }, select: { role: true } }),
    prisma.service.findUnique({ where: { id: Number(id) } })
  ]);

  const isAdmin = dbUser?.role === "ADMIN";
  const isOwner = service?.email === user.email;

  if (!isAdmin && !isOwner) throw new Error("Acesso negado");

  try {
    const updated = await prisma.service.update({
      where: { id: Number(id) },
      data: {
        name: formData.name,
        category: formData.category,
        description: formData.description,
        image: formData.image,
        whatsapp: formData.whatsapp,
        instagram: formData.instagram,
        tiktok: formData.tiktok,
        email: formData.email,
        site: formData.site,
      },
    });
    return { success: true, data: updated };
  } catch (error) {
    console.error("Prisma Error:", error);
    return { success: false };
  }
}

export async function deleteServiceAction(id: number) {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll() } }
  );

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Não autenticado");

  const [dbUser, service] = await Promise.all([
    prisma.user.findUnique({ where: { email: user.email! }, select: { role: true } }),
    prisma.service.findUnique({ where: { id: Number(id) } })
  ]);

  if (dbUser?.role !== "ADMIN" && service?.email !== user.email) {
    throw new Error("Não autorizado");
  }

  try {
    await prisma.service.delete({ where: { id: Number(id) } });
    return { success: true };
  } catch (error) {
    console.error("Delete Error:", error);
    return { success: false };
  }
}