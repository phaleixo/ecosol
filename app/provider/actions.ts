"use server";

import prisma from "@/lib/prisma";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { revalidatePath } from "next/cache";
import { Resend } from "resend";

// Inicialização do Resend para notificações automáticas
const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * HELPER: Validação de Autenticação e Permissão
 * Centraliza a lógica para evitar repetição de código (DRY).
 */
async function getAuthContext(id?: number) {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll() } }
  );

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { user: null, isAdmin: false, isOwner: false };

  const dbUser = await prisma.user.findUnique({ 
    where: { email: user.email! }, 
    select: { role: true, name: true } 
  });

  let service = null;
  if (id) {
    service = await prisma.service.findUnique({ where: { id: Number(id) } });
  }

  return {
    user,
    userName: dbUser?.name || "Usuário",
    isAdmin: dbUser?.role === "ADMIN",
    isOwner: service?.email === user.email,
    service
  };
}

/**
 * ATUALIZAÇÃO: Permite que Admin ou o Dono editem o cadastro
 */
export async function updateServiceAction(id: number, formData: any) {
  const auth = await getAuthContext(id);
  if (!auth.isAdmin && !auth.isOwner) throw new Error("Acesso negado");

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
    revalidatePath("/");
    return { success: true, data: updated };
  } catch (error) {
    console.error("Update Error:", error);
    return { success: false };
  }
}

/**
 * SOFT DELETE: Move o item para a lixeira (deletedAt)
 */
export async function deleteServiceAction(id: number) {
  const auth = await getAuthContext(id);
  if (!auth.isAdmin && !auth.isOwner) throw new Error("Acesso negado");

  try {
    await prisma.service.update({
      where: { id: Number(id) },
      data: { deletedAt: new Date() }
    });
    revalidatePath("/");
    revalidatePath("/admin/trash");
    revalidatePath("/admin/dashboard");
    return { success: true };
  } catch (error) {
    return { success: false };
  }
}

/**
 * RESTORE: Recupera da lixeira para o estado ativo
 */
export async function restoreServiceAction(id: number) {
  const auth = await getAuthContext(id);
  if (!auth.isAdmin) throw new Error("Permissão administrativa necessária");

  try {
    await prisma.service.update({
      where: { id: Number(id) },
      data: { deletedAt: null }
    });
    revalidatePath("/");
    revalidatePath("/admin/trash");
    return { success: true };
  } catch (error) {
    return { success: false };
  }
}

/**
 * HARD DELETE: Exclusão permanente do banco de dados
 */
export async function permanentDeleteAction(id: number) {
  const auth = await getAuthContext(id);
  if (!auth.isAdmin) throw new Error("Ação restrita ao administrador");

  try {
    await prisma.service.delete({ where: { id: Number(id) } });
    revalidatePath("/admin/trash");
    return { success: true };
  } catch (error) {
    return { success: false };
  }
}

/**
 * BATCH APPROVE: Aprova em massa e envia e-mails profissionais
 */
export async function approveServicesBatchAction(ids: number[]) {
  const auth = await getAuthContext();
  if (!auth.isAdmin) throw new Error("Ação restrita");

  try {
    // Busca dados para o e-mail antes da atualização
    const items = await prisma.service.findMany({
      where: { id: { in: ids.map(id => Number(id)) } },
      select: { name: true, email: true }
    });

    await prisma.service.updateMany({
      where: { id: { in: ids.map(id => Number(id)) } },
      data: { approved: true }
    });

    // Envio de e-mails em paralelo para performance
    await Promise.all(
      items.map(item => {
        if (!item.email) return;
        return resend.emails.send({
          from: 'Ecosol <contato@ecosolentreautistas.com.br>',
          to: item.email,
          subject: '🎉 Seu negócio foi aprovado na Ecosol!',
          html: `
            <div style="font-family: sans-serif; background-color: #f8fafc; padding: 40px;">
              <div style="max-width: 600px; margin: 0 auto; background: #fff; border-radius: 30px; border: 1px solid #e2e8f0; overflow: hidden;">
                <div style="background: #2563eb; padding: 30px; text-align: center; color: #fff;">
                  <h1 style="margin: 0; font-size: 24px; font-weight: 900;">ECOSOL</h1>
                  <p style="margin: 5px 0 0; font-size: 10px; text-transform: uppercase; letter-spacing: 2px;">Entre Autistas</p>
                </div>
                <div style="padding: 40px; text-align: center;">
                  <h2 style="color: #0f172a; font-size: 20px;">Boas notícias!</h2>
                  <p style="color: #64748b;">O cadastro de <strong>${item.name}</strong> foi aprovado e já está visível para a comunidade.</p>
                  <a href="${process.env.NEXT_PUBLIC_SITE_URL}" style="display: inline-block; margin-top: 25px; background: #2563eb; color: #fff; padding: 12px 30px; border-radius: 12px; text-decoration: none; font-weight: bold;">Ver no Site</a>
                </div>
                <div style="padding: 20px; background: #f1f5f9; text-align: center; font-size: 12px; color: #94a3b8;">
                  Atenciosamente, <strong>Equipe Ecosol</strong>
                </div>
              </div>
            </div>
          `
        });
      })
    );

    revalidatePath("/");
    revalidatePath("/admin/dashboard");
    return { success: true };
  } catch (error) {
    return { success: false };
  }
}

/**
 * BATCH REMOVE: Move múltiplos itens para a lixeira
 */
export async function removeServicesBatchAction(ids: number[]) {
  const auth = await getAuthContext();
  if (!auth.isAdmin) throw new Error("Ação restrita");

  try {
    await prisma.service.updateMany({
      where: { id: { in: ids.map(id => Number(id)) } },
      data: { deletedAt: new Date() }
    });
    revalidatePath("/admin/dashboard");
    revalidatePath("/admin/trash");
    return { success: true };
  } catch (error) {
    return { success: false };
  }
}

/**
 * BATCH RESTORE: Recupera múltiplos itens da lixeira
 */
export async function restoreServicesBatchAction(ids: number[]) {
  const auth = await getAuthContext();
  if (!auth.isAdmin) throw new Error("Ação restrita");

  try {
    await prisma.service.updateMany({
      where: { id: { in: ids.map(id => Number(id)) } },
      data: { deletedAt: null }
    });
    revalidatePath("/admin/trash");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    return { success: false };
  }
}

/**
 * BATCH PERMANENT DELETE: Remove definitivamente múltiplos itens
 */
export async function deleteServicesBatchAction(ids: number[]) {
  const auth = await getAuthContext();
  if (!auth.isAdmin) throw new Error("Ação restrita");

  try {
    await prisma.service.deleteMany({
      where: { id: { in: ids.map(id => Number(id)) } }
    });
    revalidatePath("/admin/trash");
    return { success: true };
  } catch (error) {
    return { success: false };
  }
}