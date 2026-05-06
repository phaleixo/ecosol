// components/contact-icons.tsx
"use client";

import * as React from "react";
import { supabase } from "@/lib/supabase";

interface ContactIconsProps {
  contacts?: {
    whatsapp?: string;
    instagram?: string;
    tiktok?: string;
    email?: string;
    site?: string;
  };
  providerEmail?: string;
  skeleton?: boolean;
}

function WhatsAppIcon({ size = 22 }: { size?: number }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 1219.547 1225.016"
      id="whatsapp"
    >
      <path
        fill="#E0E0E0"
        d="M1041.858 178.02C927.206 63.289 774.753.07 612.325 0 277.617 0 5.232 272.298 5.098 606.991c-.039 106.986 27.915 211.42 81.048 303.476L0 1225.016l321.898-84.406c88.689 48.368 188.547 73.855 290.166 73.896h.258.003c334.654 0 607.08-272.346 607.222-607.023.056-162.208-63.052-314.724-177.689-429.463zm-429.533 933.963h-.197c-90.578-.048-179.402-24.366-256.878-70.339l-18.438-10.93-191.021 50.083 51-186.176-12.013-19.087c-50.525-80.336-77.198-173.175-77.16-268.504.111-278.186 226.507-504.503 504.898-504.503 134.812.056 261.519 52.604 356.814 147.965 95.289 95.36 147.728 222.128 147.688 356.948-.118 278.195-226.522 504.543-504.693 504.543z"
      ></path>
      <linearGradient
        id="whatsapp-gradient"
        x1="609.77"
        x2="609.77"
        y1="1190.114"
        y2="21.084"
        gradientUnits="userSpaceOnUse"
      >
        <stop offset="0" stopColor="#20b038"></stop>
        <stop offset="1" stopColor="#60d66a"></stop>
      </linearGradient>
      <path
        fill="url(#whatsapp-gradient)"
        d="M27.875 1190.114l82.211-300.18c-50.719-87.852-77.391-187.523-77.359-289.602.133-319.398 260.078-579.25 579.469-579.25 155.016.07 300.508 60.398 409.898 169.891 109.414 109.492 169.633 255.031 169.57 409.812-.133 319.406-260.094 579.281-579.445 579.281-.023 0 .016 0 0 0h-.258c-96.977-.031-192.266-24.375-276.898-70.5l-307.188 80.548z"
      ></path>
      <path
        fill="#FFF"
        fillRule="evenodd"
        d="M462.273 349.294c-11.234-24.977-23.062-25.477-33.75-25.914-8.742-.375-18.75-.352-28.742-.352-10 0-26.25 3.758-39.992 18.766-13.75 15.008-52.5 51.289-52.5 125.078 0 73.797 53.75 145.102 61.242 155.117 7.5 10 103.758 166.266 256.203 226.383 126.695 49.961 152.477 40.023 179.977 37.523s88.734-36.273 101.234-71.297c12.5-35.016 12.5-65.031 8.75-71.305-3.75-6.25-13.75-10-28.75-17.5s-88.734-43.789-102.484-48.789-23.75-7.5-33.75 7.516c-10 15-38.727 48.773-47.477 58.773-8.75 10.023-17.5 11.273-32.5 3.773-15-7.523-63.305-23.344-120.609-74.438-44.586-39.75-74.688-88.844-83.438-103.859-8.75-15-.938-23.125 6.586-30.602 6.734-6.719 15-17.508 22.5-26.266 7.484-8.758 9.984-15.008 14.984-25.008 5-10.016 2.5-18.773-1.25-26.273s-32.898-81.67-46.234-111.326z"
        clipRule="evenodd"
      ></path>
      <path
        fill="#FFF"
        d="M1036.898 176.091C923.562 62.677 772.859.185 612.297.114 281.43.114 12.172 269.286 12.039 600.137 12 705.896 39.633 809.13 92.156 900.13L7 1211.067l318.203-83.438c87.672 47.812 186.383 73.008 286.836 73.047h.255.003c330.812 0 600.109-269.219 600.25-600.055.055-160.343-62.328-311.108-175.649-424.53zm-424.601 923.242h-.195c-89.539-.047-177.344-24.086-253.93-69.531l-18.227-10.805-188.828 49.508 50.414-184.039-11.875-18.867c-49.945-79.414-76.312-171.188-76.273-265.422.109-274.992 223.906-498.711 499.102-498.711 133.266.055 258.516 52 352.719 146.266 94.195 94.266 146.031 219.578 145.992 352.852-.118 274.999-223.923 498.749-498.899 498.749z"
      ></path>
    </svg>
  );
}

function InstagramIcon({ size = 22 }: { size?: number }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      fillRule="evenodd"
      clipRule="evenodd"
      imageRendering="optimizeQuality"
      shapeRendering="geometricPrecision"
      textRendering="geometricPrecision"
      viewBox="0 0 13333.33 13333.33"
      id="instagram"
    >
      <defs>
        <linearGradient
          id="instagram-gradient"
          x1="9425.49"
          x2="3907.84"
          y1="1689.61"
          y2="11643.72"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0" stopColor="#4845a2"></stop>
          <stop offset=".278" stopColor="#a844a1"></stop>
          <stop offset=".302" stopColor="#a844a1"></stop>
          <stop offset=".38" stopColor="#a844a1"></stop>
          <stop offset=".6" stopColor="#d7233e"></stop>
          <stop offset=".6" stopColor="#d7233e"></stop>
          <stop offset=".871" stopColor="#f8a325"></stop>
          <stop offset="1" stopColor="#f8dd25"></stop>
        </linearGradient>
      </defs>
      <rect width="13333.33" height="13333.33" fill="none"></rect>
      <path
        fill="url(#instagram-gradient)"
        d="M4365.91 2471.84l4601.52 0c1029.13,0 1869.24,842.02 1869.24,1869.25l0 4649.24c0,1029.14 -840.11,1871.15 -1869.24,1871.15l-4601.52 0c-1027.22,0 -1869.24,-842.02 -1869.24,-1871.15l0 -4649.24c0,-1027.23 842.02,-1869.25 1869.24,-1869.25z"
      ></path>
      <path
        fill="#fff"
        d="M8196.04 3877.12l-3058.76 0c-683.54,0 -1242.98,559.44 -1242.98,1242.98l0 3091.22c0,683.55 559.43,1242.98 1242.98,1242.98l3058.76 0c683.55,0 1242.98,-559.44 1242.98,-1242.98l0 -3091.22c0,-683.55 -559.44,-1242.98 -1242.98,-1242.98zm729.37 4047.8l0 0c0,555.62 -456.33,1011.95 -1011.95,1011.95l-2491.69 0c-557.53,0 -1011.95,-456.33 -1011.95,-1011.95l0 -2516.51c0,-557.53 454.42,-1011.95 1011.95,-1011.95l2491.69 0c555.62,0 1011.95,454.42 1011.95,1011.95l0 2516.51z"
      ></path>
      <path
        fill="#fff"
        fillRule="nonzero"
        d="M6666.67 5290.03c-758.01,0 -1374.73,618.63 -1374.73,1376.63 0,758.01 616.72,1374.73 1374.73,1374.73 758.01,0 1376.63,-616.72 1376.63,-1374.73 0,-758.01 -618.62,-1376.63 -1376.63,-1376.63zm0 2287.39l0 0c-502.16,0 -910.76,-408.6 -910.76,-910.76 0,-502.16 408.6,-910.75 910.76,-910.75 502.15,0 910.75,408.59 910.75,910.75 0,502.16 -408.6,910.76 -910.75,910.76z"
      ></path>
      <path
        fill="#fff"
        d="M9436.86 3868.69c156.57,0 282.58,-126.02 282.58,-280.67 0,-156.56 -126.02,-282.58 -282.58,-282.58 -154.66,0 -280.67,126.02 -280.67,282.58 0,154.66 126.02,280.67 280.67,280.67z"
      ></path>
    </svg>
  );
}

// Ícone TikTok oficial - Preenchimentos Rosa e Ciano
function TikTokIcon({ size = 20 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 64 64"
      id="tiktok"
    >
      <path
        fill="#070201"
        fillRule="evenodd"
        d="m60,12c0-4.42-3.58-8-8-8H12C7.58,4,4,7.58,4,12v40c0,4.42,3.58,8,8,8h40c4.42,0,8-3.58,8-8V12h0Z"
      ></path>
      <path
        fill="#fe2c55"
        fillRule="evenodd"
        d="m47.64,27.65c0,.3-.13.58-.37.77-.23.19-.53.22-.83.21-1.86-.05-4.77-.69-6.14-2v12.54c0,5.78-4.68,10.46-10.46,10.46h-1.08c-2.42,0-4.72-.88-6.58-2.39,1.43.71,3,1.13,4.63,1.13h1.08c5.78,0,10.46-4.68,10.46-10.46v-12.54c1.37,1.3,4.28,1.95,6.14,2,.3,0,.6-.02.83-.21.23-.19.37-.47.37-.77,0-1.42,0-3.78,0-5.02.38.11.77.2,1.16.29.46.1.79.5.79.97,0,1.24,0,3.61,0,5.02Zm-19.58,4.43c-.19.19-.44.29-.71.29-2.76,0-5,2.24-5,5,0,2.17,1.39,4,3.33,4.69-.85-.9-1.38-2.1-1.38-3.43,0-2.76,2.24-5,5-5,.27,0,.52-.1.71-.29.19-.19.29-.44.29-.71v-3c0-.26-.11-.52-.29-.71s-.44-.29-.71-.29h-.54c-.14,0-.27.04-.41.04v2.7c0,.27-.11.52-.29.71Zm13.67-12.69c-.83-.75-1.53-1.74-2.03-3.09-.15-.39-.52-.67-.94-.67h-.74c.87,1.91,2.16,3.03,3.71,3.75Z"
      ></path>
      <path
        fill="#25f4ee"
        fillRule="evenodd"
        d="m21.37,46.57c.25.25.55.45.82.67-1.01-.5-1.96-1.12-2.77-1.93-1.96-1.96-3.06-4.62-3.06-7.4v-.08c0-5.78,4.68-10.46,10.46-10.46h.54c.27,0,.52.11.71.29.19.19.29.44.29.71v.3c-5.58.22-10.05,4.78-10.05,10.42v.08c0,2.77,1.1,5.43,3.06,7.4Zm24.31-25.2h0c0-.47-.33-.88-.79-.97-1.12-.25-2.19-.55-3.17-1.01,1.11,1,2.47,1.57,3.95,1.98Zm-16.38,22.27c1.33,0,2.6-.53,3.54-1.46s1.46-2.21,1.46-3.54v-22c0-.55.45-1,1-1h2.72c-.09-.2-.19-.38-.27-.6-.15-.39-.52-.67-.94-.67h-3.46c-.55,0-1,.45-1,1v22c0,1.33-.53,2.6-1.46,3.54s-2.21,1.46-3.54,1.46c-.59,0-1.15-.12-1.67-.31.91.96,2.19,1.57,3.62,1.57Z"
      ></path>
      <path
        fill="#fff"
        fillRule="evenodd"
        d="m27.9,48.37c5.78,0,10.46-4.68,10.46-10.46v-12.54c1.37,1.3,4.28,1.95,6.14,2,.3,0,.6-.02.83-.21.23-.19.37-.47.37-.77,0-1.42,0-3.78,0-5.02-1.48-.41-2.84-.98-3.95-1.98-1.54-.72-2.84-1.85-3.71-3.75h-2.72c-.55,0-1,.45-1,1v22c0,1.33-.53,2.6-1.46,3.54s-2.21,1.46-3.54,1.46c-1.43,0-2.71-.61-3.62-1.57-1.93-.69-3.33-2.52-3.33-4.69,0-2.76,2.24-5,5-5,.27,0,.52-.1.71-.29.19-.19.29-.44.29-.71v-2.7c-5.58.22-10.05,4.78-10.05,10.42v.08c0,2.77,1.1,5.43,3.06,7.4.25.25.55.45.82.67,1.43.71,3,1.13,4.63,1.13h1.08Z"
      ></path>
    </svg>
  );
}

// Ícone Email oficial - Gmail com envelope vermelho
function EmailIcon({ size = 20 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <rect x="2" y="4" width="20" height="16" rx="2" fill="#639cb6" />
      <path
        d="M22 7L12 13L2 7"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <path
        d="M2 17L8 11"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <path
        d="M22 17L16 11"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}

// Ícone Site/Globo oficial - Azul do Google Chrome
function SiteIcon({ size = 20 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10" fill="#4285F4" />
      <path
        d="M12 2C14.5 5 16 8 16 12C16 16 14.5 19 12 22"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M12 2C9.5 5 8 8 8 12C8 16 9.5 19 12 22"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M3 12H21"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
      />
      <circle cx="12" cy="12" r="3" fill="white" />
    </svg>
  );
}

function ContactLink({
  href,
  children,
  title,
  skeleton = false,
  onWhatsAppClick,
}: {
  href?: string;
  children: React.ReactNode;
  title: string;
  skeleton?: boolean;
  onWhatsAppClick?: () => void;
}) {
  if (skeleton || !href) {
    return (
      <div
        title={title}
        className="inline-flex items-center justify-center h-10 w-10 rounded-xl bg-muted border border-border animate-pulse"
        aria-hidden="true"
      >
        <div className="h-5 w-5 bg-muted-foreground/20 rounded" />
      </div>
    );
  }

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.stopPropagation();
    onWhatsAppClick?.();
  };

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer noopener"
      title={title}
      className="inline-flex items-center justify-center h-10 w-10 rounded-xl bg-muted border border-border hover:bg-primary/10 hover:border-primary/30 transition-all duration-200 active:scale-90"
      onClick={handleClick}
    >
      {children}
    </a>
  );
}

export default function ContactIcons({
  contacts,
  providerEmail,
  skeleton = false,
}: ContactIconsProps) {
  if (!contacts && !skeleton) return null;

  const formatWhatsAppLink = (phone: string) => {
    let cleaned = phone.replace(/\D/g, "");
    if (cleaned.length >= 10 && cleaned.length <= 11) {
      cleaned = `55${cleaned}`;
    }
    return `https://wa.me/${cleaned}`;
  };

  const notifyWhatsAppClick = async () => {
    if (!providerEmail) return;

    const payload = JSON.stringify({ providerEmail });

    // 1. Enviar notificação ao servidor (em banco de dados)
    if (navigator.sendBeacon) {
      navigator.sendBeacon(
        "/api/notifications",
        new Blob([payload], { type: "application/json" }),
      );
    } else {
      void fetch("/api/notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: payload,
        keepalive: true,
      });
    }

    // 2. Disparar notificação nativa do PWA APENAS se o usuário é o proprietário
    try {
      // ✅ VERIFICAÇÃO DE SEGURANÇA: Apenas o proprietário recebe notificação PWA
      const { data: { user }, error } = await supabase.auth.getUser();
      
      // Só dispara notificação PWA se o usuário autenticado é o proprietário
      if (!error && user && user.email?.toLowerCase() === providerEmail.toLowerCase()) {
        if ("serviceWorker" in navigator && "Notification" in window) {
          // Pedir permissão se necessário
          if (Notification.permission === "default") {
            await Notification.requestPermission();
          }

          // Se permissão foi concedida, disparar notificação
          if (Notification.permission === "granted" && navigator.serviceWorker.controller) {
            navigator.serviceWorker.ready.then((registration) => {
              registration.showNotification("Novo interesse! 🎯", {
                badge: "/icons/icon-192.png",
                icon: "/icons/icon-192.png",
                tag: "whatsapp-notification",
                requireInteraction: false,
                body: "Alguém clicou no seu WhatsApp e deve enviar uma mensagem em breve.",
              });
            });
          }
        }
      }
    } catch (error) {
      console.error("Erro ao disparar notificação nativa:", error);
    }
  };

  const contactTypes = [
    {
      key: "whatsapp",
      title: "WhatsApp",
      icon: <WhatsAppIcon size={20} />,
      value: contacts?.whatsapp,
      href: contacts?.whatsapp
        ? formatWhatsAppLink(contacts.whatsapp)
        : undefined,
    },
    {
      key: "instagram",
      title: "Instagram",
      icon: <InstagramIcon size={22} />,
      value: contacts?.instagram,
      href: contacts?.instagram
        ? `https://instagram.com/${contacts.instagram.replace("@", "")}`
        : undefined,
    },
    {
      key: "tiktok",
      title: "TikTok",
      icon: <TikTokIcon size={20} />,
      value: contacts?.tiktok,
      href: contacts?.tiktok
        ? `https://tiktok.com/@${contacts.tiktok.replace("@", "")}`
        : undefined,
    },
    {
      key: "email",
      title: "E-mail",
      icon: <EmailIcon size={20} />,
      value: contacts?.email,
      href: contacts?.email ? `mailto:${contacts.email}` : undefined,
    },
    {
      key: "site",
      title: "Site Oficial",
      icon: <SiteIcon size={20} />,
      value: contacts?.site,
      href: contacts?.site
        ? contacts.site.startsWith("http")
          ? contacts.site
          : `https://${contacts.site}`
        : undefined,
    },
  ];

  const visibleContacts = skeleton
    ? contactTypes
    : contactTypes.filter((contact) => contact.value);

  if (visibleContacts.length === 0 && !skeleton) return null;

  return (
    <div className="flex items-center gap-1 pl-0.5">
      {visibleContacts.map((contact) => (
        <ContactLink
          key={contact.key}
          href={contact.href}
          title={contact.title}
          skeleton={skeleton}
          onWhatsAppClick={
            contact.key === "whatsapp" ? notifyWhatsAppClick : undefined
          }
        >
          {contact.icon}
        </ContactLink>
      ))}
    </div>
  );
}
