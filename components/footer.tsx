"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { ShieldCheck, MessageCircle, Globe, Users, ArrowRight, Rocket, Cpu, Network, Target } from "lucide-react";

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
    description:
      "Plataforma colaborativa que conecta profissionais autistas, promovendo autonomia financeira e colaboração técnica em ambiente inclusivo.",
    copyright: `© ${new Date().getFullYear()} Ecosol • Gestão de Economia Solidária`,
    version: "v1.1.4", // Versão de fallback (caso a API falhe)
    logo: "/ecosol-meta.png",
    termsUrl: "/terms",
    repoPath: "EcoSolTEA/ecosol", // Caminho do seu repositório
  },
  contacts: [
    { name: "Larissa Matos", role: "Moderadora", phone: "553199784140" },
    { name: "Bruno Grossi", role: "Moderador", phone: "553195677447" },
  ] as Contact[],
  team: [
    {
      name: "Paulo Aleixo",
      role: "PHALEIXO - Soluções Digitais",
      url: "https://www.phaleixo.dev",
      icon: Cpu,
    },
    {
      name: "Daniel de Paula",
      role: "Desenvolvedor",
      url: "https://danielchrono.github.io/Website/",
      icon: Globe,
    },
    {
      name: "Bruno Grossi",
      role: "Idealização",
      url: "https://associacaoproautistas.com.br/",
      icon: Users,
    },
  ] as Creator[],
  social: {
    instagram: "",
    linkedin: "",
    github: "",
    facebook: "",
    youtube: "",
    twitter: "",
  },
  waMessage:
    "Olá, gostaria de solicitar o link de entrada para o grupo da Rede Ecosol.",
};

const ContactCard = ({
  contact,
  message,
}: {
  contact: Contact;
  message: string;
}) => {
  const whatsappUrl = `https://wa.me/${contact.phone}?text=${encodeURIComponent(
    message
  )}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center p-1.5 rounded-xl bg-background/50 border hover:border-primary/30 transition-colors group w-full"
    >
      <div className="flex items-center gap-2 shrink-0">
        <MessageCircle size={12} className="text-primary" />
        <div className="flex flex-col justify-center">
          <span className="text-[9px] font-black uppercase tracking-tight block leading-none">
            {contact.name}
          </span>
          <span className="text-[8px] text-muted-foreground font-bold uppercase tracking-tighter block leading-none mt-1">
            Solicitar Link
          </span>
        </div>
      </div>
      <div className="flex-1 flex justify-center items-center">
        <ArrowRight
          size={10}
          className="text-primary opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all"
        />
      </div>
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
        <span className="text-[10px] font-black uppercase tracking-widest group-hover:text-primary transition-colors block leading-tight">
          {member.name}
        </span>
        <span className="text-[8px] text-muted-foreground font-bold uppercase tracking-tighter block">
          {member.role}
        </span>
      </div>
    </a>
  );
};

function InstagramIcon({ size = 13 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
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

function LinkedinIcon({ size = 13 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="2" y="3" width="20" height="18" rx="2" ry="2" />
      <path d="M7 10v8" />
      <path d="M7 7v.01" />
      <path d="M11 18v-6a2 2 0 0 1 2-2h0a2 2 0 0 1 2 2v6" />
    </svg>
  );
}

function GithubIcon({ size = 13 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M9 19c-5 1.5-5-2.5-7-3" />
      <path d="M20 12c0 4-3 7-8 7s-8-3-8-7c0-3 2-5 4-6" />
      <path d="M12 3v4" />
    </svg>
  );
}

function FacebookIcon({ size = 13 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M18 2h-3a4 4 0 0 0-4 4v3H8v4h3v8h4v-8h3l1-4h-4V6a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

function YoutubeIcon({ size = 13 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="2" y="5" width="20" height="14" rx="2" ry="2" />
      <polygon points="10 9 16 12 10 15 10 9" />
    </svg>
  );
}

function TwitterIcon({ size = 13 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53A4.48 4.48 0 0 0 12 7v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" />
    </svg>
  );
}

export default function Footer() {
  const [mounted, setMounted] = React.useState(false);
  const [currentVersion, setCurrentVersion] = React.useState(
    CONFIG.platform.version
  );

  React.useEffect(() => {
    setMounted(true);

    const fetchVersion = async () => {
      try {
        // 1. Tenta buscar o Release mais recente
        const releaseRes = await fetch(
          `https://api.github.com/repos/${CONFIG.platform.repoPath}/releases/latest`
        );
        if (releaseRes.ok) {
          const data = await releaseRes.json();
          if (data.tag_name) {
            setCurrentVersion(data.tag_name);
            return;
          }
        }

        // 2. Fallback: Busca a última Tag se não houver Releases oficiais
        const tagsRes = await fetch(
          `https://api.github.com/repos/${CONFIG.platform.repoPath}/tags`
        );
        if (tagsRes.ok) {
          const tagsData = await tagsRes.json();
          if (tagsData.length > 0) {
            setCurrentVersion(tagsData[0].name);
          }
        }
      } catch (error) {
        console.error("Erro ao obter versão do GitHub:", error);
      }
    };

    fetchVersion();
  }, []);

  if (!mounted) return null;

  const { platform, contacts, team, social, waMessage } = CONFIG;

  const socialIcons = [
    { id: "instagram", icon: InstagramIcon, url: social.instagram },
    { id: "linkedin", icon: LinkedinIcon, url: social.linkedin },
    { id: "github", icon: GithubIcon, url: social.github },
    { id: "facebook", icon: FacebookIcon, url: social.facebook },
    { id: "youtube", icon: YoutubeIcon, url: social.youtube },
    { id: "twitter", icon: TwitterIcon, url: social.twitter },
  ].filter((s) => s.url !== "");

  return (
    <footer className="w-full border-t bg-card text-card-foreground">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 items-start">
          <div className="col-span-2 md:col-span-2 space-y-3">
            <div className="flex items-center gap-2 shrink-0">
              <div className="relative h-7 w-7 overflow-hidden rounded-md">
                <Image
                  src={platform.logo}
                  alt="Logo Ecosol"
                  fill
                  className="object-contain"
                  sizes="28px"
                />
              </div>
              <span className="font-black text-base uppercase tracking-tighter whitespace-nowrap">
                {platform.name}
              </span>
            </div>

            <p className="text-[10px] leading-relaxed text-muted-foreground font-bold uppercase tracking-wider max-w-100 text-justify">
              {platform.description}
            </p>

            <div className="flex flex-nowrap items-center justify-between gap-1 sm:gap-3 max-w-100 w-full overflow-hidden">
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

          <div className="md:col-span-1 bg-muted/30 border rounded-3xl p-2 flex flex-col items-center justify-start w-full max-w-45 mx-auto">
            <h3 className="text-[9px] font-black uppercase tracking-[0.4em] text-muted-foreground/60 mb-2 border-b border-border/50 pb-1 w-full text-center">
              Comunidade
            </h3>
            <div className="flex flex-col gap-1.5 w-full items-center">
              {contacts.map((contact) => (
                <ContactCard
                  key={contact.phone}
                  contact={contact}
                  message={waMessage}
                />
              ))}
              <div className="text-center w-full">
                <span className="text-[8px] font-bold text-muted-foreground/60 uppercase tracking-wider leading-none">
                  Resposta em até 24h
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
                {currentVersion}
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
