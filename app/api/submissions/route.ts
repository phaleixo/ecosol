import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // 1. Cria o registro no banco (visão de engenharia: approved inicia como false)
    const created = await prisma.service.create({ 
      data: { ...body, approved: false } 
    });

    // 2. Dispara e-mail para o Admin informando a pendência
    if (created.id) {
      await resend.emails.send({
        from: 'Ecosol <notificacoes@ecosolentreautistas.com.br>',
        to: 'daniel_dp_lopes@hotmail.com', // Seu e-mail de administrador
        subject: '🚨 Nova Aprovação Pendente - Ecosol',
        html: `
          <div style="font-family: sans-serif; max-width: 600px; border: 1px solid #e2e8f0; border-radius: 24px; padding: 40px;">
            <h2 style="color: #0f172a; font-weight: 900; font-size: 24px;">Novo Cadastro Recebido</h2>
            <p style="color: #64748b;">O negócio <strong>${body.name}</strong> foi enviado e aguarda sua revisão no painel.</p>
            <div style="margin-top: 32px;">
              <a href="${process.env.NEXT_PUBLIC_SITE_URL}/admin/dashboard" 
                 style="background: #2563eb; color: white; padding: 14px 28px; border-radius: 12px; text-decoration: none; font-weight: bold; display: inline-block;">
                Acessar Painel de Controle
              </a>
            </div>
          </div>
        `
      });
    }

    return NextResponse.json({ ok: true, id: created.id });
  } catch (err) {
    console.error("Erro na submissão:", err);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}