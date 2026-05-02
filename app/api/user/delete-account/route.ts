// app/api/user/delete-account/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function DELETE(request: Request) {
  try {
    const cookieStore = await cookies();
    
    // Criar cliente Supabase para verificar sessão
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              );
            } catch {
              // Ignorar erro em middleware
            }
          },
        },
      }
    );

    // Verificar sessão do usuário
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const userId = session.user.id;
    const userEmail = session.user.email;

    if (!userEmail) {
      return NextResponse.json({ error: "E-mail não encontrado" }, { status: 400 });
    }

    // Buscar usuário no Prisma
    const user = await prisma.user.findUnique({
      where: { email: userEmail }
    });

    if (!user) {
      return NextResponse.json({ error: "Usuário não encontrado no sistema" }, { status: 404 });
    }

    // Deletar dados do Prisma
    await prisma.notification.deleteMany({
      where: { userId: user.id }
    });

    await prisma.service.deleteMany({
      where: { email: userEmail }
    });

    await prisma.user.delete({
      where: { email: userEmail }
    });

    // Deletar do Supabase Auth usando Service Role
    const supabaseAdmin = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              );
            } catch {
              // Ignorar erro
            }
          },
        },
      }
    );

    const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(userId);

    if (deleteError) {
      console.error("Erro ao deletar do Supabase Auth:", deleteError);
      return NextResponse.json({ 
        success: true, 
        warning: true,
        message: "Conta removida do sistema, mas houve um erro na autenticação. Entre em contato com o suporte." 
      });
    }

    return NextResponse.json({ 
      success: true, 
      message: "Conta excluída com sucesso do sistema e da autenticação." 
    });

  } catch (error) {
    console.error("Erro ao excluir conta:", error);
    return NextResponse.json({ error: "Erro interno no servidor" }, { status: 500 });
  }
}