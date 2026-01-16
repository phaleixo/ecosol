"use client";

import * as React from "react";
import { MessageCircle, Globe, Mail, Music2 } from "lucide-react";

interface ContactIconsProps {
  contacts: {
    whatsapp?: string;
    instagram?: string;
    tiktok?: string;
    email?: string;
    site?: string;
  };
}

/**
 * Componente de Ícone Unificado (Refatorado para Dark Mode)
 */
function ContactLink({
  href,
  children,
  title,
}: {
  href: string;
  children: React.ReactNode;
  title: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      title={title}
      /* Logística de Cores Dinâmicas:
         - bg-slate-50 -> bg-muted (Adapta ao fundo)
         - text-slate-400 -> text-muted-foreground
         - hover:bg-blue-50 -> hover:bg-primary/10 (Feedback sutil)
      */
      className="inline-flex items-center justify-center h-9 w-9 rounded-xl bg-muted text-muted-foreground border border-border hover:bg-primary/10 hover:text-primary hover:border-primary/30 transition-all duration-200 active:scale-90"
    >
      {children}
    </a>
  );
}

function InstagramIcon({
  size = 18,
  strokeWidth = 2.5,
}: {
  size?: number;
  strokeWidth?: number;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="3" y="3" width="18" height="18" rx="5" ry="5" />
      <circle cx="12" cy="12" r="3.5" />
      <circle cx="17.5" cy="6.5" r="0.5" />
    </svg>
  );
}

export default function ContactIcons({ contacts }: ContactIconsProps) {
  // Se não houver contatos, a logística para aqui para economizar processamento
  if (!contacts) return null;

  return (
    <div className="flex items-center gap-1.5">
      {contacts.whatsapp && (
        <ContactLink
          href={`https://wa.me/${contacts.whatsapp.replace(/\D/g, "")}`}
          title="WhatsApp"
        >
          <MessageCircle size={18} strokeWidth={2.5} />
        </ContactLink>
      )}

      {contacts.instagram && (
        <ContactLink
          href={`https://instagram.com/${contacts.instagram.replace("@", "")}`}
          title="Instagram"
        >
          <InstagramIcon size={18} strokeWidth={2.5} />
        </ContactLink>
      )}

      {contacts.tiktok && (
        <ContactLink
          href={`https://tiktok.com/@${contacts.tiktok.replace("@", "")}`}
          title="TikTok"
        >
          <Music2 size={18} strokeWidth={2.5} />
        </ContactLink>
      )}

      {contacts.email && (
        <ContactLink href={`mailto:${contacts.email}`} title="E-mail">
          <Mail size={18} strokeWidth={2.5} />
        </ContactLink>
      )}

      {contacts.site && (
        <ContactLink href={contacts.site} title="Site Oficial">
          <Globe size={18} strokeWidth={2.5} />
        </ContactLink>
      )}
    </div>
  );
}
