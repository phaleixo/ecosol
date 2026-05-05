import prisma from "@/lib/prisma";
import Header from "@/components/header";
import ContactIcons from "@/components/contact-icons";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Button } from "@/components/ui/button";
import ProviderShareButton from "@/components/provider-share-button";
import Link from "next/link";
import Image from "next/image";
import { cookies, headers } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { ArrowLeft, Settings, Eye } from "lucide-react";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  process.env.NEXTAUTH_URL ||
  "http://localhost:3000";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const providerId = Number.parseInt(id, 10);

  if (Number.isNaN(providerId)) {
    return {
      title: "Prestador não encontrado",
      robots: { index: false, follow: false },
    };
  }

  const service = await prisma.service.findUnique({
    where: { id: providerId },
    select: {
      name: true,
      description: true,
      category: true,
      image: true,
      approved: true,
    },
  });

  if (!service || !service.approved) {
    return {
      title: "Prestador não encontrado",
      robots: { index: false, follow: false },
    };
  }

  const requestHeaders = await headers();
  const forwardedProto = requestHeaders.get("x-forwarded-proto") ?? "https";
  const forwardedHost =
    requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host");

  const runtimeOrigin = forwardedHost
    ? `${forwardedProto}://${forwardedHost}`
    : siteUrl;

  const url = `${runtimeOrigin}/provider/${providerId}`;
  const ogImageUrl = `${url}/opengraph-image`;
  const descriptionBase =
    service.description?.trim() ||
    "Conheça este perfil na ECOSOL Autista e veja como falar com o profissional.";
  const description =
    descriptionBase.length > 155
      ? `${descriptionBase.slice(0, 152)}...`
      : descriptionBase;

  const categoryLabel = service.category
    .split(" ")
    .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  let title = `${service.name} | ${categoryLabel} | Agende pelo WhatsApp`;
  if (title.length > 60) {
    title = `${service.name} | ${categoryLabel} | ECOSOL Autista`;
  }
  if (title.length < 50) {
    title = `${title} | Atendimento online`;
  }
  if (title.length > 60) {
    title = `${title.slice(0, 57)}...`;
  }

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: "article",
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: `${service.name} - ${service.category || "Prestador"}`,
        },
      ],
      locale: "pt_BR",
      siteName: "ECOSOL Autista",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImageUrl],
    },
  };
}

export default async function ProviderPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll() } },
  );

  // LOGÍSTICA DE DADOS PARALELA
  const [
    {
      data: { user },
    },
    service,
  ] = await Promise.all([
    supabase.auth.getUser(),
    prisma.service.findUnique({ where: { id: parseInt(id) } }),
  ]);

  if (!service) return notFound();

  const dbUser = user
    ? await prisma.user.findUnique({
        where: { email: user.email },
        select: { role: true },
      })
    : null;

  const isAdmin = dbUser?.role === "ADMIN";
  const isOwner = user?.email === service.email;
  const canEdit = isAdmin || isOwner;

  // SEGURANÇA DE ACESSO
  if (!service.approved && !canEdit) return notFound();

  // CONTADOR DE VISUALIZAÇÕES (Somente para visitantes externos)
  if (service.approved && !canEdit) {
    await prisma.service.update({
      where: { id: parseInt(id) },
      data: { views: { increment: 1 } },
    });
  }

  return (
    <div className="min-h-screen bg-background text-foreground pb-20 transition-colors duration-300">
      <Header />

      <main className="mx-auto max-w-6xl p-6 py-12 flex flex-col items-center">
        {/* TOP BAR: Navegação e Ações de Edição */}
        <div className="w-full flex justify-between items-center mb-10">
          <Link
            href="/"
            className="group inline-flex items-center gap-2 text-primary text-[10px] font-black uppercase tracking-[0.2em] hover:opacity-80 transition-all bg-primary/5 px-4 py-2.5 rounded-xl border border-primary/10"
          >
            <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
            <span>Voltar para a busca</span>
          </Link>

          {canEdit && (
            <Link
              href={
                isAdmin ? `/admin/provider/${id}/edit` : `/provider/edit/${id}`
              }
            >
              <Button
                variant="outline"
                className="h-11 rounded-xl border-primary/20 bg-card text-primary font-black text-[10px] uppercase tracking-widest gap-2 shadow-sm hover:bg-primary/10 transition-all"
              >
                <Settings className="w-4 h-4" />
                {isAdmin ? "Admin Edit" : "Editar Negócio"}
              </Button>
            </Link>
          )}
        </div>

        {/* CARD PRINCIPAL CENTRALIZADO */}
        <div className="w-full bg-card rounded-sm shadow-xl border border-border p-3 md:p-6 flex flex-col md:flex-row gap-8 md:gap-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {/* CONTAINER DA IMAGEM */}
          <div className="w-full md:w-2/5 aspect-[4/3] rounded-sm bg-muted overflow-hidden border border-border shadow-inner relative shrink-0">
            {service.image ? (
              <Image
                src={service.image}
                alt={service.name}
                fill
                priority
                loading="eager"
                sizes="(max-width: 768px) 100vw, 40vw"
                className="object-contain"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-muted">
                <span className="text-2xl grayscale opacity-20">🏢</span>
              </div>
            )}
          </div>

          {/* CONTEÚDO E INFO */}
          <div className="flex-1 flex flex-col py-2">
            <div className="flex flex-wrap items-center gap-3 mb-5">
              <span className="text-[9px] font-black text-primary uppercase tracking-[0.25em] px-4 py-1.5 bg-primary/10 rounded-full border border-primary/10">
                {service.category}
              </span>

              <ProviderShareButton
                providerId={service.id}
                name={service.name}
                category={service.category}
              />

              {canEdit && (
                <span className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-muted-foreground bg-muted/50 px-3 py-1.5 rounded-full border border-border">
                  <Eye className="w-3.5 h-3.5" /> {service.views} visitas
                </span>
              )}
            </div>

            <h1 className="text-2xl md:text-3xl font-black text-foreground tracking-tighter uppercase leading-none mb-6">
              {service.name}
            </h1>

            <p className="text-sm md:text-base text-muted-foreground leading-relaxed font-medium whitespace-pre-wrap mb-10">
              {service.description}
            </p>

            <div className="mt-auto space-y-8">
              {/* Onde me encontrar */}
              <div className="space-y-4">
                <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground/40 border-b border-border/50 pb-2">
                  Onde me encontrar
                </h3>
                <ContactIcons
                  contacts={{
                    whatsapp: service.whatsapp ?? undefined,
                    instagram: service.instagram ?? undefined,
                    tiktok: service.tiktok ?? undefined,
                    email: service.email ?? undefined,
                    site: service.site ?? undefined,
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
