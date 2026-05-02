import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
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

// Template Base atualizado para combinar com o padrão Supabase
const emailWrapper = (content: string) => `
  <div style="background-color: #f7f7f7; padding: 40px 20px; font-family: sans-serif; text-align: center;">
    <div style="max-width: 500px; background-color: #ffffff; margin: 0 auto; padding: 40px; border-radius: 40px; border: 1px solid #e2e8f0; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
      <img src="https://ecosolautista.com.br/ecosol-meta.png" alt="EcoSolTEA" style="height: 50px; margin-bottom: 20px;">
      ${content}
      <div style="margin-top: 35px; padding-top: 20px; border-top: 1px solid #f1f5f9;">
        <p style="color: #94a3b8; font-size: 11px; text-transform: uppercase; letter-spacing: 1px;">Economia Solidária Entre Autistas</p>
      </div>
    </div>
  </div>
`;

export async function POST(req: Request) {
  const cookieStore = await cookies();
  
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll() },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set({ name, value, ...options })
            )
          } catch (error) { console.error(error); }
        },
      },
    }
  );

  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { ok: false, error: "Acesso não autorizado." },
        { status: 401 }
      );
    }

    const body = await req.json();
    const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://ecosolautista.com.br";

    // 1. Registro no Prisma
    const created = await prisma.service.create({ 
      data: { 
        ...body, 
        approved: false,
        email: user.email 
      } 
    });

    if (created.id) {
      // 2. Busca Admins com Nome e Email
      const admins = await prisma.user.findMany({
        where: { role: 'ADMIN' },
        select: { email: true, name: true }
      });

      const emailPromises = [];

      // 3. Template para os Admins - Atualizado para combinar com padrão Supabase
      if (admins && admins.length > 0) {
        admins.forEach((admin: { email: string | null; name: string | null }) => {          if (!admin.email) return;
          emailPromises.push(
            transporter.sendMail({
              from: `"EcoSol" <${process.env.GMAIL_USER}>`,
              to: admin.email,
              subject: '🚀 Nova Aprovação Pendente - EcoSol',
              html: emailWrapper(`
                <h2 style="color: #0f172a; text-transform: uppercase; letter-spacing: -1px; font-size: 24px; margin-bottom: 10px;">Nova Submissão</h2>
                <p style="color: #475569; font-size: 16px; line-height: 1.5; margin-bottom: 20px;">
                  Olá, <strong>${admin.name || 'Administrador'}</strong>!<br>
                  Existe um novo negócio aguardando sua revisão na plataforma:
                  <br>
                  <strong style="color: #3b82f6; font-size: 18px;">${body.name}</strong>
                </p>
                <p style="color: #64748b; font-size: 14px; line-height: 1.5; margin-bottom: 30px;">
                  Por favor, revise o cadastro o mais breve possível.
                </p>
                <a href="${SITE_URL}/admin/dashboard" 
                   style="display: inline-block; margin-top: 20px; background-color: #3b82f6; color: #ffffff; padding: 15px 30px; border-radius: 15px; text-decoration: none; font-weight: bold; text-transform: uppercase; font-size: 14px; letter-spacing: 1px;">
                   Revisar Cadastro
                </a>
                <p style="margin-top: 30px; color: #94a3b8; font-size: 12px;">
                  Esta é uma notificação automática do sistema EcoSol.
                </p>
              `)
            })
          );
        });
      }

      // 4. Template para o Usuário (Owner) - Atualizado para combinar com padrão Supabase
      if (user.email) {
        emailPromises.push(
          transporter.sendMail({
            from: `"EcoSol" <${process.env.GMAIL_USER}>`,
            to: user.email,
            subject: '🌿 Recebemos seu cadastro - EcoSol',
            html: emailWrapper(`
              <h2 style="color: #0f172a; text-transform: uppercase; letter-spacing: -1px; font-size: 24px; margin-bottom: 10px;">Submissão Recebida!</h2>
              <p style="color: #475569; font-size: 16px; line-height: 1.5; margin-bottom: 20px;">
                Olá! Obrigado por cadastrar o negócio <strong>${body.name}</strong> na rede <strong>ECOSOL</strong>.
              </p>
              <p style="color: #475569; font-size: 16px; line-height: 1.5; margin-bottom: 30px;">
                Sua publicação agora passará por nossa curadoria técnica. Você receberá uma nova notificação assim que o perfil for aprovado e estiver visível para a comunidade.
              </p>
              <div style="background-color: #f1f5f9; padding: 20px; border-radius: 10px; margin: 25px 0;">
                <p style="color: #475569; font-size: 14px; margin: 0;">
                  <strong>📋 Dados recebidos:</strong><br>
                  Nome: ${body.name}<br>
                  Categoria: ${body.category}<br>
                  Data: ${new Date().toLocaleDateString('pt-BR')}
                </p>
              </div>
              <p style="color: #64748b; font-size: 14px; line-height: 1.5;">
                Tempo estimado para revisão: 1-3 dias úteis.
              </p>
            `)
          })
        );
      }

      // 5. ENVIO NÃO-BLOQUEANTE
      Promise.all(emailPromises).catch(err => {
        console.error("Erro no envio de e-mails (mas o dado foi salvo):", err.message);
      });
    }

    return NextResponse.json({ ok: true, id: created.id });
  } catch (err) {
    console.error("Erro crítico na submissão:", err);
    return NextResponse.json(
      { ok: false, error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}