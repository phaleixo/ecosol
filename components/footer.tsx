"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  ShieldCheck, 
  MessageCircle, 
  Globe, 
  Users,
  Instagram,
  Linkedin,
  Github,
  Facebook,
  Youtube,
  Twitter,
  ArrowRight,
  Rocket,
  Cpu,
  Network,
  Target
} from "lucide-react";

interface Contact { 
  name: string; 
  role: string; 
  phone: string; 
}

interface Creator { 
  name: string; 
  role: string; 
  url: string; 
  icon: React.ComponentType<any>; 
}

const CONFIG = {
  platform: {
    name: "ECOSOL",
    description: "Plataforma colaborativa que conecta profissionais autistas, promovendo autonomia financeira e colaboração técnica em ambiente inclusivo.",
    copyright: `© ${new Date().getFullYear()} Ecosol • Gestão de Economia Solidária`,
    version: "v1.0.2",
    logo: "/logo.png",
    termsUrl: "/terms"
  },
  contacts: [
    { name: "Larissa Matos", role: "Moderadora", phone: "553199784140" },
    { name: "Bruno Grossi", role: "Moderador", phone: "553195677447" },
  ] as Contact[],
  team: [
    { name: "Paulo Aleixo", role: "PHALEIXO - Soluções Digitais", url: "https://www.phaleixo.dev", icon: Cpu },
    { name: "Daniel de Paula", role: "Desenvolvedor", url: "https://danielchrono.github.io/Website/", icon: Globe },
    { name: "Bruno Grossi", role: "Idealização", url: "https://associacaoproautistas.com.br/", icon: Users },
  ] as Creator[],
  social: {
    instagram: "",
    linkedin: "",
    github: "", 
    facebook: "",
    youtube: "",
    twitter: "",
  },
  waMessage: "Olá, gostaria de solicitar o link de entrada para o grupo da Rede Ecosol."
};

const ContactCard = ({ contact, message }: { contact: Contact; message: string }) => {
  const whatsappUrl = `https://wa.me/${contact.phone}?text=${encodeURIComponent(message)}`;
  
  return (
    <a 
      href={whatsappUrl}
      target="_blank" 
      rel="noopener noreferrer"
      className="flex items-center justify-between p-1.5 gap-3 rounded-xl bg-background/50 border hover:border-primary/30 transition-colors group w-full"
    >
      <div className="flex items-center gap-2">
        <MessageCircle size={12} className="text-primary" />
        <div>
          <span className="text-[9px] font-black uppercase tracking-tight block leading-none">{contact.name}</span>
          <span className="text-[8px] text-muted-foreground font-bold uppercase tracking-tighter block mt-0.5">Solicitar Link</span>
        </div>
      </div>
      <ArrowRight size={10} className="text-primary opacity-0 group-hover:translate-x-1 group-hover:opacity-100 transition-all" />
    </a>
  );
};

const TeamMember = ({ member }: { member: Creator }) => {
  const Icon = member.icon;
  
  return (
    <a 
      href={member.url} 
      target="_blank" 
      rel="noopener noreferrer"
      className="group flex items-center gap-2 p-1 rounded-lg hover:bg-muted/30 transition-colors w-full"
    >
      <div className="h-6 w-6 rounded-lg bg-muted flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
        <Icon size={11} />
      </div>
      <div className="flex-1">
        <span className="text-[10px] font-black uppercase tracking-widest group-hover:text-primary transition-colors block leading-tight">{member.name}</span>
        <span className="text-[8px] text-muted-foreground font-bold uppercase tracking-tighter block">{member.role}</span>
      </div>
    </a>
  );
};

export default function Footer() {
  const [mounted, setMounted] = React.useState(false);
  
  React.useEffect(() => {
    setMounted(true);
  }, []);
  
  if (!mounted) return null;

  const { platform, contacts, team, social, waMessage } = CONFIG;

  const socialIcons = [
    { id: 'instagram', icon: Instagram, url: social.instagram },
    { id: 'linkedin', icon: Linkedin, url: social.linkedin },
    { id: 'github', icon: Github, url: social.github },
    { id: 'facebook', icon: Facebook, url: social.facebook },
    { id: 'youtube', icon: Youtube, url: social.youtube },
    { id: 'twitter', icon: Twitter, url: social.twitter },
  ].filter(s => s.url !== "");

  return (
    <footer className="w-full border-t bg-card text-card-foreground">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-6">
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 items-start">
          
          <div className="col-span-2 md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="relative h-7 w-7 rounded-full border overflow-hidden">
                <Image 
                  src={platform.logo} 
                  alt="Logo Ecosol" 
                  fill 
                  className="object-cover" 
                  sizes="24px" 
                />
              </div>
              <span className="font-black text-base uppercase tracking-tight">{platform.name}</span>
            </div>
            
            <p className="text-[10px] leading-relaxed text-muted-foreground font-bold uppercase tracking-wider max-w-[400px] text-justify">
              {platform.description}
            </p>

            {/* Ajuste: max-w-[400px] e justify-between para alinhar com o fim do texto */}
            <div className="flex flex-nowrap items-center justify-between gap-1 sm:gap-3 max-w-[400px] w-full overflow-hidden">
              <div className="flex items-center gap-1 sm:gap-1.5 text-[7px] min-[400px]:text-[8px] sm:text-[9px] font-black uppercase tracking-tight sm:tracking-wider text-primary whitespace-nowrap shrink">
                <Rocket size={11} className="shrink-0" />
                <span>Inovação Social</span>
              </div>
              <div className="flex items-center gap-1 sm:gap-1.5 text-[7px] min-[400px]:text-[8px] sm:text-[9px] font-black uppercase tracking-tight sm:tracking-wider text-primary whitespace-nowrap shrink">
                <Network size={11} className="shrink-0" />
                <span>Rede Colaborativa</span>
              </div>
              <div className="flex items-center gap-1 sm:gap-1.5 text-[7px] min-[400px]:text-[8px] sm:text-[9px] font-black uppercase tracking-tight sm:tracking-wider text-primary whitespace-nowrap shrink">
                <Target size={11} className="shrink-0" />
                <span>Impacto Real</span>
              </div>
            </div>

            {socialIcons.length > 0 && (
              <div className="flex gap-1.5 mt-3">
                {socialIcons.map((social) => (
                  <Link 
                    key={social.id} 
                    href={social.url} 
                    target="_blank"
                    className="p-1.5 rounded-md bg-muted/50 border hover:text-primary hover:border-primary/30 transition-colors"
                  >
                    <social.icon size={13} />
                  </Link>
                ))}
              </div>
            )}
          </div>

          <div className="col-span-1 md:col-span-1 space-y-2">
            <h3 className="text-[9px] font-black uppercase tracking-[0.4em] text-muted-foreground/60 border-b pb-1 text-center whitespace-nowrap">
              Corpo Técnico
            </h3>
            <div className="flex flex-col gap-1 md:pl-10">
              {team.map((member) => (
                <TeamMember key={member.name} member={member} />
              ))}
            </div>
          </div>

          <div className="col-span-1 md:col-span-1 bg-muted/30 border rounded-[1.5rem] p-2 flex flex-col items-center justify-start w-full mx-auto">
            <h3 className="text-[9px] font-black uppercase tracking-[0.4em] text-muted-foreground/60 mb-1 border-b border-border/50 pb-1 w-full text-center">
              Comunidade
            </h3>
            <div className="flex flex-col gap-1 w-full items-center">
              {contacts.map((contact) => (
                <ContactCard key={contact.phone} contact={contact} message={waMessage} />
              ))}
              <div className="text-center w-full mt-1">
                <span className="text-[8px] font-bold text-muted-foreground/60 uppercase tracking-wider leading-none">
                  Até 24h
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t flex flex-col md:grid md:grid-cols-4 items-center gap-3">
          <div className="md:col-span-3 flex flex-col md:flex-row items-center gap-3 md:gap-8 justify-start w-full">
            <p className="text-[9px] font-bold text-muted-foreground/40 uppercase tracking-tight md:tracking-[0.4em] whitespace-nowrap">
              {platform.copyright}
            </p>
            
            <Link 
              href={platform.termsUrl}
              className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-[0.2em] text-primary hover:text-primary/70 transition-colors leading-none"
            >
              <ShieldCheck size={11} />
              Termos de Uso & LGPD
            </Link>
          </div>

          <div className="md:col-span-1 flex justify-center md:justify-end w-full">
            <div className="flex items-center justify-center px-2.5 h-6 rounded-full bg-primary/5 border border-primary/10">
              <span className="text-[9px] font-black text-primary uppercase tracking-widest leading-none">
                {platform.version}
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}