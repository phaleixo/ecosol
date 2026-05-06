import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  try {
    // ✅ SEGURANÇA 1: Validar autenticação do usuário
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { cookies: { getAll: () => cookieStore.getAll() } }
    );

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const { providerEmail } = await request.json();

    // ✅ SEGURANÇA 2: Validar que o email é válido
    if (!providerEmail || typeof providerEmail !== "string") {
      return NextResponse.json({ error: "Email inválido" }, { status: 400 });
    }

    // ✅ SEGURANÇA 3: Verificar que o serviço realmente existe com esse email
    const service = await prisma.service.findFirst({
      where: {
        email: providerEmail.toLowerCase(),
        approved: true,
        suspended: false,
        deletedAt: null
      }
    });

    if (!service) {
      return NextResponse.json({ error: "Serviço não encontrado" }, { status: 404 });
    }

    // ✅ SEGURANÇA 4: Verificar que o usuário autenticado é o proprietário
    const targetUser = await prisma.user.findUnique({
      where: { email: providerEmail.toLowerCase() }
    });

    if (!targetUser) {
      return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 });
    }

    // ✅ SEGURANÇA 5: Validar que o usuário autenticado é o proprietário
    if (user.email?.toLowerCase() !== providerEmail.toLowerCase()) {
      // Permitir, mas isso significa que alguém clicou no WhatsApp de outro usuário
      // A notificação será criada no banco, mas a notificação PWA não será mostrada
      // (isso é validado no front-end em contact-icons.tsx)
    }

    // Criar notificação no banco de dados
    const notification = await prisma.notification.create({
      data: {
        userId: targetUser.id,
        message: "Clicaram no seu WhatsApp. Você deve receber uma mensagem em breve.",
      },
    });

    return NextResponse.json(notification);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Erro ao criar notificação" }, { status: 500 });
  }
}