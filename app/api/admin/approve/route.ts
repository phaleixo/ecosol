import prisma from "../../../../lib/prisma"

export async function POST(req: Request) {
  const body = await req.json()
  const { id } = body
  await prisma.service.update({ where: { id }, data: { approved: true } })
  return new Response(JSON.stringify({ ok: true }))
}
