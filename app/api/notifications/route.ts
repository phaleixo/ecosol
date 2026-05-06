import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { providerEmail } = await request.json();

    // ✅ SEGURANÇA 1: Validar que o email é válido
    if (!providerEmail || typeof providerEmail !== "string") {
      return NextResponse.json({ error: "Email inválido" }, { status: 400 });
    }

    // ✅ SEGURANÇA 2: Verificar que o serviço realmente existe com esse email
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

    // ✅ SEGURANÇA 3: Buscar o proprietário do perfil
    const targetUser = await prisma.user.findUnique({
      where: { email: providerEmail.toLowerCase() }
    });

    if (!targetUser) {
      return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 });
    }

    // Criar notificação no banco de dados para o proprietário do perfil
    // Qualquer pessoa (logada ou não) pode disparar essa notificação
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