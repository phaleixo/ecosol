import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get("email");

  if (!email) return NextResponse.json({ error: "E-mail requerido" }, { status: 400 });

  try {
    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true },
    });

    // Visão de Engenharia: Retorna vazio em vez de erro para novos usuários
    if (!user) {
      const response = NextResponse.json([]);
      response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
      response.headers.set('Pragma', 'no-cache');
      response.headers.set('Expires', '0');
      return response;
    }

    const notifications = await prisma.notification.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      take: 10,
    });

    const response = NextResponse.json(notifications);
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
    return response;
  } catch (error) {
    console.error("Erro API Notifications:", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const { ids, email, all } = await request.json();
    const whereClause = all ? { user: { email }, read: false } : { id: { in: ids } };

    await prisma.notification.updateMany({
      where: whereClause,
      data: { read: true },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Erro ao atualizar" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { ids, email, all } = await request.json();
    const whereClause = all ? { user: { email } } : { id: { in: ids } };

    await prisma.notification.deleteMany({ where: whereClause });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Erro ao excluir" }, { status: 500 });
  }
}