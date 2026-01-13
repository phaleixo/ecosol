import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const trashed = await prisma.service.findMany({
      where: {
        deletedAt: { not: null }, // Filtra apenas o que está na lixeira
      },
      orderBy: {
        deletedAt: 'desc',
      },
      // Garantimos que todos os campos necessários sejam enviados
      select: {
        id: true,
        name: true,
        category: true,
        image: true,
        deletedAt: true, 
      }
    });

    return NextResponse.json(trashed);
  } catch (error) {
    return NextResponse.json({ error: "Erro ao carregar lixeira" }, { status: 500 });
  }
}