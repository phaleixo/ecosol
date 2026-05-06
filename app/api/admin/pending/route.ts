import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic"; // Garante dados sempre atualizados

export async function GET() {
  try {
    const pendingServices = await prisma.service.findMany({
      where: {
        approved: false,
        suspended: false,
        deletedAt: null, // Garante que não pega o que já foi para a lixeira
      },
      orderBy: { createdAt: "desc" },
    });

    const response = NextResponse.json(pendingServices);
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
    return response;
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Erro na carga de pendentes" }, { status: 500 });
  }
}