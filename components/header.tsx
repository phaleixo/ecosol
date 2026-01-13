"use client";
import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { supabase } from "@/lib/supabase";
import { Button } from "./ui/button";
import NotificationModal from "./notification-modal";
import { 
  Bell, 
  LogOut, 
  User as UserIcon, 
  LayoutDashboard, 
  PlusCircle,
  ChevronDown 
} from "lucide-react";

export default function Header() {
  const [user, setUser] = React.useState<any>(null);
  const [role, setRole] = React.useState<string>("USER");
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = React.useState(false);
  const [notifications, setNotifications] = React.useState([]);
  const [pendingCount, setPendingCount] = React.useState(0);

  const menuRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const loadAdminData = async () => {
    try {
      const res = await fetch('/api/admin/count');
      if (res.ok) {
        const { count } = await res.json();
        setPendingCount(count);
      }
    } catch (err) { console.error("Erro count:", err); }
  };

  const loadUserData = async (email: string) => {
    try {
      const [roleRes, notifyRes] = await Promise.all([
        fetch(`/api/user/role?email=${email}`),
        fetch(`/api/user/notifications?email=${email}`)
      ]);
      if (roleRes.ok) {
        const { role: userRole } = await roleRes.json();
        setRole(userRole);
        if (userRole === "ADMIN") loadAdminData();
      }
      if (notifyRes.ok) setNotifications(await notifyRes.json());
    } catch (err) { console.error("Erro data fetch:", err); }
  };

  React.useEffect(() => {
    const initAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user?.email) {
        setUser(session.user);
        loadUserData(session.user.email);
      }
    };
    initAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user?.email) {
        setUser(session.user);
        loadUserData(session.user.email);
      } else {
        setUser(null);
        setRole("USER");
        setNotifications([]);
        setPendingCount(0);
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  const hasUnread = notifications.some((n: any) => !n.read);

  return (
    <>
      <header className="w-full border-b bg-white sticky top-0 z-40 border-slate-200 shadow-sm h-14">
        <div className="mx-auto max-w-6xl h-full flex items-center justify-between px-3 sm:px-4">
          
          {/* LOGO: Agora realmente grande no mobile e robusta no desktop */}
          <Link href="/" className="flex items-center gap-2 group shrink-0">
            <div className="relative h-9 w-9 sm:h-10 sm:w-10 overflow-hidden rounded-full border border-slate-100 group-hover:scale-105 transition-transform">
              <Image src="/logo.png" alt="Logo Ecosol" fill className="object-cover" />
            </div>
            <div className="flex flex-col">
              <span className="font-black text-lg sm:text-xl tracking-tighter text-slate-900 leading-none uppercase">ECOSOL</span>
              <span className="text-[8px] sm:text-[10px] text-blue-600 font-bold uppercase tracking-[0.15em] sm:tracking-[0.2em]">Entre Autistas</span>
            </div>
          </Link>

          <nav className="flex items-center gap-1.5 sm:gap-4">
            {!user ? (
              <Link href="/login">
                <Button variant="ghost" className="font-bold text-slate-600 h-9 text-xs sm:text-sm px-3">Entrar</Button>
              </Link>
            ) : (
              <div className="flex items-center gap-1.5 sm:gap-3">
                
                {role === "ADMIN" && (
                  <Link href="/admin/dashboard" className="relative group">
                    <Button variant="outline" className="border-blue-100 text-blue-600 font-black h-9 px-2 sm:px-4 rounded-xl flex items-center gap-2">
                      <LayoutDashboard className="h-4 w-4 sm:h-4 sm:w-4" /> 
                      <span className="text-[9px] sm:text-xs uppercase tracking-tighter sm:tracking-normal">
                        <span className="sm:hidden">Admin</span>
                        <span className="hidden sm:inline">Painel Admin</span>
                      </span>
                    </Button>
                    {pendingCount > 0 && (
                      <div className="absolute -top-1 -right-1 bg-red-600 text-white text-[9px] font-black h-5 w-5 rounded-full flex items-center justify-center ring-2 ring-white animate-bounce">
                        {pendingCount}
                      </div>
                    )}
                  </Link>
                )}

                <Link href="/submit">
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white font-black h-9 px-2 sm:px-5 rounded-xl flex items-center gap-2 shadow-md shadow-blue-100">
                    <PlusCircle className="h-4 w-4 sm:h-4 sm:w-4" /> 
                    <span className="text-[9px] sm:text-xs uppercase tracking-tighter sm:tracking-normal">
                      <span className="sm:hidden">Negócio</span>
                      <span className="hidden sm:inline">Novo Negócio</span>
                    </span>
                  </Button>
                </Link>

                <button 
                  onClick={() => setIsModalOpen(true)}
                  className="relative p-2 text-slate-400 hover:text-blue-600 transition-colors"
                >
                  <Bell className="h-5 w-5 sm:h-6 sm:w-6" />
                  {hasUnread && (
                    <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-blue-600 rounded-full border-2 border-white"></span>
                  )}
                </button>

                {/* PERFIL */}
                <div className="relative" ref={menuRef}>
                  <button 
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center gap-1 p-0.5 pr-1 sm:pr-2 rounded-full border border-slate-100 hover:bg-slate-50 transition-all shadow-sm"
                  >
                    <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-black uppercase">
                      {user.email?.[0]}
                    </div>
                    <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform ${isUserMenuOpen ? 'rotate-180' : ''} hidden sm:block`} />
                  </button>

                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-2xl shadow-2xl py-1.5 z-50 overflow-hidden">
                      <div className="px-4 py-3 border-b border-slate-50 bg-slate-50/50">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Usuário Autenticado</p>
                        <p className="text-xs font-bold text-slate-700 truncate">{user.email}</p>
                      </div>
                      <div className="p-1.5 space-y-1">
                        <Link href="/profile" onClick={() => setIsUserMenuOpen(false)} className="flex items-center gap-3 px-3 py-2 text-sm font-bold text-slate-600 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-colors">
                          <UserIcon className="h-4 w-4" /> Perfil da Conta
                        </Link>
                        <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2 text-sm font-bold text-red-500 hover:bg-red-50 rounded-xl transition-colors">
                          <LogOut className="h-4 w-4" /> Encerrar Sessão
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </nav>
        </div>
      </header>

      <NotificationModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        notifications={notifications}
        userEmail={user?.email || ""}
        onRefresh={() => loadUserData(user?.email || "")}
      />
    </>
  );
}