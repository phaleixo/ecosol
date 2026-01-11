import prisma from "../../../../lib/prisma"

export async function GET() {
  const pending = await prisma.service.findMany({ where: { approved: false } })
  return new Response(JSON.stringify(pending), { status: 200 })
}
