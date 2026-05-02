import prisma from "@/lib/prisma";
import Header from "@/components/header";
import ThemeToggleInline from "@/components/theme-toggle-inline";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import LogoutButton from "@/components/logout-button";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createServerClient } from "@supabase/ssr";
import NotificationActions from "@/components/notification-actions";
import { UserCircle, Settings, Bell, Eye, MessageSquare, ArrowLeft } from "lucide-react";

export default async function ProfilePage() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll() } }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  let dbUser = await prisma.user.findUnique({
    where: { email: user.email! },
    include: { notifications: { orderBy: { createdAt: "desc" }, take: 5 } },
  });

  if (!dbUser) {
    dbUser = await prisma.user.create({
      data: {
        email: user.email!,
        name: user.user_metadata?.name || user.email?.split("@")[0],
        role: "USER",
      },
      include: { notifications: true },
    });
  }

  const [service, unreadCount, totalCount] = await Promise.all([
    prisma.service.findFirst({ where: { email: user.email! } }),
    prisma.notification.count({ where: { userId: dbUser.id, read: false } }),
    prisma.notification.count({ where: { userId: dbUser.id } }),
  ]);

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300 pb-20">
      <Header />
      <main className="mx-auto max-w-6xl p-6 py-12">
        {/* BARRA DE NAVEGAÇÃO E CONTROLES SUPERIOR */}
        <div className="flex justify-between items-center mb-10">
          <Link 
            href="/" 
            className="group inline-flex items-center gap-2 text-primary text-[10px] font-black uppercase tracking-[0.2em] hover:opacity-80 transition-all bg-primary/5 px-4 py-2.5 rounded-xl border border-primary/10"
          >
            <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" /> 
            <span>Voltar</span>
          </Link>

          {/* ÁREA DE CONTROLES GLOBAL (Desktop e Mobile) */}
          <div className="flex items-center bg-card/50 backdrop-blur-sm rounded-2xl border border-border/50 shadow-lg p-1.5 gap-1">
            <Link href="/profile/edit">
              <Button
                variant="ghost"
                size="sm"
                className="h-10 md:h-11 px-2.5 md:px-4 rounded-xl font-black text-[10px] uppercase tracking-widest gap-2 hover:bg-muted transition-all"
                title="Configurações"
              >
                <Settings className="w-5 h-5 md:w-4 md:h-4" />
                <span className="hidden md:inline">Configurações</span>
              </Button>
            </Link>
            
            <div className="h-5 w-px bg-border/50 mx-0.5" />
            
            <LogoutButton mobile className="md:hidden" />
            <div className="hidden md:block">
              <LogoutButton />
            </div>
            
            <div className="h-5 w-px bg-border/50 mx-0.5" />
            
            <ThemeToggleInline className="h-10 md:h-11 w-10 md:w-11 rounded-xl border border-border/50 bg-card flex items-center justify-center shadow-sm hover:bg-muted transition-colors p-0" />
          </div>
        </div>

        {/* HEADER DA PÁGINA: IDENTIDADE (DESKTOP) */}
        <section className="hidden md:flex items-center mb-12 gap-6">
          <div className="p-4 bg-primary/10 rounded-3xl text-primary shadow-inner">
            <UserCircle size={32} />
          </div>
          <div>
            <h2 className="text-3xl font-black tracking-tighter text-foreground uppercase leading-none">Meu Perfil</h2>
            <p className="text-muted-foreground font-medium mt-1">{user.email}</p>
          </div>
        </section>

        {/* HEADER DA PÁGINA: IDENTIDADE (MOBILE) */}
        <section className="md:hidden flex flex-col items-start mb-12 gap-6">
          <div className="flex items-center gap-5">
            <div className="p-4 bg-primary/10 rounded-3xl text-primary shadow-inner">
              <UserCircle size={32} />
            </div>
            <div>
              <h2 className="text-3xl font-black tracking-tighter text-foreground uppercase leading-none">Meu Perfil</h2>
              <p className="text-muted-foreground font-medium mt-1 truncate max-w-[200px]">{user.email}</p>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* INFO CARD */}
          <div className="lg:col-span-2 bg-card p-8 md:p-10 rounded-[2.5rem] shadow-md border border-border flex flex-col justify-center">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-muted-foreground/50 uppercase tracking-[0.2em]">
                  Nome cadastrado
                </label>
                <p className="text-lg md:text-xl font-black text-foreground tracking-tight uppercase">
                  {dbUser.name || "Não informado"}
                </p>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-muted-foreground/50 uppercase tracking-[0.2em]">
                  Contato WhatsApp
                </label>
                <p className="text-lg md:text-xl font-black text-foreground tracking-tight">
                  {dbUser.phone || "Não informado"}
                </p>
              </div>
            </div>
          </div>

          {/* VISUALIZAÇÕES CARD */}
          <div className="bg-primary p-8 md:p-10 rounded-[2.5rem] shadow-2xl flex flex-col items-center justify-center text-center relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-125 transition-transform duration-500">
              <Eye className="w-20 h-20 md:w-24 md:h-24 text-primary-foreground" />
            </div>
            <h3 className="text-5xl md:text-7xl font-black text-primary-foreground tracking-tighter leading-none">
              {service?.views || 0}
            </h3>
            <p className="text-primary-foreground/80 text-[11px] font-black uppercase tracking-[0.2em] mt-2">
              Visitas no seu Card
            </p>
          </div>
        </div>

        {/* NOTIFICAÇÕES */}
        <section className="bg-card rounded-[2.5rem] shadow-md border border-border overflow-hidden">
          <div className="px-6 md:px-10 py-6 md:py-8 border-b border-border flex flex-col sm:flex-row justify-between items-center gap-4 bg-muted/20">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-2xl text-primary">
                <Bell className="w-5 h-5 md:w-6 md:h-6" />
              </div>
              <div>
                <h2 className="text-lg md:text-xl font-black text-foreground tracking-tight uppercase">
                  Notificações
                </h2>
                <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">
                  Fluxo de Atividade
                </p>
              </div>
            </div>
            <NotificationActions
              email={user.email!}
              unreadCount={unreadCount}
              totalCount={totalCount}
            />
          </div>

          <div className="p-4 md:p-10 space-y-4 bg-card">
            {dbUser.notifications.length === 0 ? (
              <div className="py-12 md:py-16 text-center">
                <MessageSquare className="w-10 h-10 md:w-12 md:h-12 text-muted-foreground/20 mx-auto mb-4" />
                <p className="text-muted-foreground font-bold italic text-sm">
                  Nenhuma notificação por enquanto.
                </p>
              </div>
            ) : (
              dbUser.notifications.map((n: any) => (
                <div
                  key={String(n.id)}
                  className={`group p-4 md:p-6 rounded-2xl md:rounded-3xl border transition-all duration-300 ${
                    n.read
                      ? "bg-muted/10 border-border opacity-50"
                      : "bg-primary/5 border-primary/20 shadow-sm"
                  }`}
                >
                  <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-2 md:gap-8">
                    <p
                      className={`text-sm leading-relaxed ${
                        n.read
                          ? "text-muted-foreground font-medium"
                          : "text-foreground font-black"
                      }`}
                    >
                      {n.message}
                    </p>
                    <span className="text-[10px] font-black text-muted-foreground/60 uppercase whitespace-nowrap pt-1 font-mono">
                      {new Date(n.createdAt).toLocaleDateString("pt-BR")}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </main>
    </div>
  );
}