import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { providerEmail } = await request.json();

    // 1. Primeiro buscamos o ID do usuário pelo e-mail
    const user = await prisma.user.findUnique({
      where: { email: providerEmail }
    });

    if (!user) {
      return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 });
    }

    // 2. Agora criamos a notificação usando o ID real
    const notification = await prisma.notification.create({
      data: {
        userId: user.id, // ID vindo do banco
        message: "Clicaram no seu WhatsApp. Você deve receber uma mensagem em breve.",
      },
    });

    return NextResponse.json(notification);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Erro ao criar notificação" }, { status: 500 });
  }
}