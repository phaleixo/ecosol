import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    // Busca serviços pendentes e não suspensos
    const pendingServices = await prisma.service.findMany({
      where: {
        approved: false,
        suspended: false,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(pendingServices);
  } catch (error) {
    console.error("Erro na API de Pendentes:", error);
    return NextResponse.json({ error: "Erro ao buscar dados" }, { status: 500 });
  }
}