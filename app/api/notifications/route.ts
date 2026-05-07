import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { transporter } from "@/lib/mail";

export async function POST(request: Request) {
  try {
    const { providerEmail } = await request.json();

    // ✅ SEGURANÇA 1: Validar que o email é válido
    if (!providerEmail || typeof providerEmail !== "string") {
      return NextResponse.json({ error: "Email inválido" }, { status: 400 });
    }

    // ✅ SEGURANÇA 2: Verificar que o serviço realmente existe com esse email
    const service = await prisma.service.findFirst({
      where: {
        email: providerEmail.toLowerCase(),
        approved: true,
        suspended: false,
        deletedAt: null
      }
    });

    if (!service) {
      return NextResponse.json({ error: "Serviço não encontrado" }, { status: 404 });
    }

    // ✅ SEGURANÇA 3: Buscar o proprietário do perfil
    const targetUser = await prisma.user.findUnique({
      where: { email: providerEmail.toLowerCase() }
    });

    if (!targetUser) {
      return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 });
    }

    // Criar notificação no banco de dados para o proprietário do perfil
    // Qualquer pessoa (logada ou não) pode disparar essa notificação
    const notification = await prisma.notification.create({
      data: {
        userId: targetUser.id,
        message: "Clicaram no seu WhatsApp. Você deve receber uma mensagem em breve.",
      },
    });

    // Enviar email para o proprietário do perfil
    try {
      const serviceName = service.name || "seu serviço";
      await transporter.sendMail({
        from: process.env.GMAIL_USER,
        to: providerEmail.toLowerCase(),
        subject: `🎯 Novo interesse em ${serviceName}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px 10px 0 0; color: white; text-align: center;">
              <h1 style="margin: 0; font-size: 28px;">🎯 Novo Interesse!</h1>
            </div>
            <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e0e0e0; border-top: none;">
              <p style="font-size: 16px; color: #333; margin-top: 0;">
                Olá ${targetUser.name || "Proprietário"},
              </p>
              <p style="font-size: 16px; color: #555; line-height: 1.6;">
                Alguém clicou no botão WhatsApp do seu perfil <strong>${serviceName}</strong>. 
                <br><br>
                Você deve receber uma mensagem em breve. Fique atento! 📱
              </p>
              <div style="background: white; padding: 15px; border-left: 4px solid #667eea; margin: 20px 0; border-radius: 4px;">
                <p style="margin: 0; color: #666; font-size: 14px;">
                  <strong>Data:</strong> ${new Date().toLocaleString("pt-BR")}
                </p>
              </div>
              <p style="font-size: 12px; color: #999; text-align: center; margin-top: 30px;">
                Esta é uma notificação automática de ${process.env.NEXT_PUBLIC_APP_NAME || "ECOSOL Hub"}
              </p>
            </div>
          </div>
        `,
      });
    } catch (emailError) {
      console.error("Erro ao enviar email:", emailError);
      // Não falhar a requisição se o email não conseguir ser enviado
    }

    return NextResponse.json(notification);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Erro ao criar notificação" }, { status: 500 });
  }
}