"use client";
import * as React from "react";
import { 
  Instagram, 
  MessageCircle, 
  Globe, 
  Mail, 
  Music2 // Ícone moderno para TikTok
} from "lucide-react";

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
 * Componente de Ícone Unificado
 * Mantém o padrão visual de "botão suave"
 */
function ContactLink({ 
  href, 
  children, 
  title 
}: { 
  href: string; 
  children: React.ReactNode; 
  title: string 
}) {
  return (
    <a 
      href={href} 
      target="_blank" 
      rel="noreferrer"
      title={title}
      className="inline-flex items-center justify-center h-9 w-9 rounded-xl bg-slate-50 text-slate-400 border border-slate-100 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-100 transition-all duration-200"
    >
      {children}
    </a>
  );
}

export default function ContactIcons({ contacts }: ContactIconsProps) {
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
          <Instagram size={18} strokeWidth={2.5} />
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