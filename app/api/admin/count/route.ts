import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const count = await prisma.service.count({
      where: { approved: false, deletedAt: null }
    });
    const response = NextResponse.json({ count });
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
    return response;
  } catch (error) {
    console.error(error);
    return NextResponse.json({ count: 0 }, { status: 500 });
  }
}