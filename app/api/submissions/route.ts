import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // 1. Cria o registro no banco
    const created = await prisma.service.create({ 
      data: { ...body, approved: false } 
    });

    if (created.id) {
      // 2. NOTIFICAÇÃO PARA O ADMIN (Você)
      // Avisa que existe um novo card pendente de aprovação
      const adminMail = transporter.sendMail({
        from: `"Sistema Ecosol" <${process.env.GMAIL_USER}>`,
        to: process.env.GMAIL_USER, // Envia para o próprio e-mail do admin (ecosoltea@gmail.com)
        subject: '🚨 Nova Aprovação Pendente - Ecosol',
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 20px; padding: 30px;">
            <h2 style="color: #0f172a;">Novo Cadastro para Revisão</h2>
            <p>O negócio <strong>${body.name}</strong> foi enviado por <strong>${body.email}</strong>.</p>
            <p>Acesse o painel para aprovar ou rejeitar.</p>
            <a href="${process.env.NEXT_PUBLIC_SITE_URL}/admin/dashboard" 
               style="background: #2563eb; color: white; padding: 12px 24px; border-radius: 10px; text-decoration: none; display: inline-block; font-weight: bold;">
               Ir para o Dashboard
            </a>
          </div>
        `
      });

      // 3. NOTIFICAÇÃO PARA O OWNER (Criador do Card)
      // Confirma para o usuário que o cadastro dele foi recebido
      const ownerMail = body.email ? transporter.sendMail({
        from: `"Ecosol" <${process.env.GMAIL_USER}>`,
        to: body.email, // E-mail de quem preencheu o formulário
        subject: '🌿 Recebemos seu cadastro - Ecosol',
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 20px; padding: 30px;">
            <h2 style="color: #2563eb;">Olá, recebemos sua submissão!</h2>
            <p>Obrigado por cadastrar o negócio <strong>${body.name}</strong> na nossa plataforma.</p>
            <p>Sua publicação está em análise e você receberá um e-mail assim que ela for aprovada pelo administrador.</p>
            <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
            <p style="font-size: 12px; color: #64748b;">Equipe Ecosol Entre Autistas</p>
          </div>
        `
      }) : Promise.resolve();

      // Executa os envios em paralelo para não travar a resposta
      await Promise.all([adminMail, ownerMail]).catch(err => 
        console.error("Erro no disparo de e-mails:", err)
      );
    }

    return NextResponse.json({ ok: true, id: created.id });
  } catch (err) {
    console.error("Erro na submissão:", err);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}