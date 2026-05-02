import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { email, name, termsVersion } = await request.json();

    if (!email) {
      return NextResponse.json({ error: "E-mail obrigatório" }, { status: 400 });
    }

    /**
     * UPSERT: Sincroniza o Auth do Supabase com o DB Local.
     * Registramos o aceite dos termos também no Prisma para auditoria facilitada.
     */
    const user = await prisma.user.upsert({
      where: { email },
      update: {
        // Se o usuário já existia mas está re-sincronizando (ex: trocou senha ou confirmou e-mail agora)
        name: name || email.split('@')[0],
      },
      create: {
        email,
        role: "USER",
        name: name || email.split('@')[0],
        // Nota: Se você tiver esses campos no seu schema.prisma, descomente abaixo:
        // acceptedTerms: true,
        // termsVersion: termsVersion || "1.0.2",
        // acceptedAt: new Date(),
      },
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error("Erro ao sincronizar usuário:", error);
    return NextResponse.json({ error: "Erro interno no servidor" }, { status: 500 });
  }
}