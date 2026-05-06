import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const trashed = await prisma.service.findMany({
      where: {
        deletedAt: { not: null },
      },
      orderBy: { deletedAt: 'desc' },
      select: {
        id: true,
        name: true,
        category: true,
        image: true,
        description: true,
        whatsapp: true,
        instagram: true,
        tiktok: true,
        email: true,
        site: true,
        deletedAt: true,
      }
    });

    const response = NextResponse.json(trashed);
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
    return response;
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Erro ao carregar limbo" }, { status: 500 });
  }
}