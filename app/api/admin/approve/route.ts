import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { id } = await request.json();

    const updated = await prisma.service.update({
      where: { id: Number(id) },
      data: { approved: true },
    });

    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: "Falha na aprovação" }, { status: 500 });
  }
}