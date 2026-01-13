import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { id, type } = await request.json();

    if (type === "suspend") {
      await prisma.service.update({
        where: { id: Number(id) },
        data: { suspended: true },
      });
    } else if (type === "remove") {
      await prisma.service.delete({
        where: { id: Number(id) },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Falha ao executar ação" }, { status: 500 });
  }
}