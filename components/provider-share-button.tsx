"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Share2,
  Link2,
  MessageCircle,
  Send,
  Facebook,
  Linkedin,
} from "lucide-react";

type ProviderShareButtonProps = {
  providerId: number;
  name: string;
  category?: string | null;
  description?: string | null;
};

function encode(value: string) {
  return encodeURIComponent(value);
}

export default function ProviderShareButton({
  providerId,
  name,
  category,
  description,
}: ProviderShareButtonProps) {
  const [copied, setCopied] = useState(false);
  const [isNativeShareSupported, setIsNativeShareSupported] = useState(false);

  const shareUrl = useMemo(() => {
    if (typeof window === "undefined") return "";
    return `${window.location.origin}/provider/${providerId}`;
  }, [providerId]);

  const shareTitle = useMemo(() => {
    const categoryPart = category ? ` | ${category}` : "";
    return `${name}${categoryPart} | ECOSOL Autista`;
  }, [name, category]);

  const shareText = useMemo(() => {
    const cleanDescription = (description || "").trim();
    const categoryText = category ? `Categoria: ${category}. ` : "";
    if (cleanDescription) {
      return `${name}. ${categoryText}${cleanDescription}`;
    }
    return `${name}. ${categoryText}Conheça este perfil no ECOSOL Autista.`;
  }, [name, category, description]);

  useEffect(() => {
    if (
      typeof navigator !== "undefined" &&
      typeof navigator.share === "function"
    ) {
      setIsNativeShareSupported(true);
    }
  }, []);

  const encodedUrl = encode(shareUrl);
  const encodedText = encode(shareText);

  const socialLinks = [
    {
      key: "whatsapp",
      label: "WhatsApp",
      icon: <MessageCircle className="h-4 w-4" />,
      href: `https://wa.me/?text=${encodedText}%20${encodedUrl}`,
    },
    {
      key: "facebook",
      label: "Facebook",
      icon: <Facebook className="h-4 w-4" />,
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    },
    {
      key: "x",
      label: "X (Twitter)",
      icon: <Share2 className="h-4 w-4" />,
      href: `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`,
    },
    {
      key: "telegram",
      label: "Telegram",
      icon: <Send className="h-4 w-4" />,
      href: `https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`,
    },
    {
      key: "linkedin",
      label: "LinkedIn",
      icon: <Linkedin className="h-4 w-4" />,
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    },
  ];

  const handleCopy = async () => {
    if (!shareUrl) return;
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  const handleNativeShare = async () => {
    if (!isNativeShareSupported || !shareUrl) return;
    try {
      await navigator.share({
        title: shareTitle,
        text: shareText,
        url: shareUrl,
      });
    } catch {
      // noop: usuário cancelou ou plataforma bloqueou
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="h-8 px-3 rounded-full border-primary/20 bg-card text-primary font-black text-[9px] uppercase tracking-[0.2em] gap-2 hover:bg-primary/10"
          aria-label="Compartilhar perfil"
        >
          <Share2 className="h-3.5 w-3.5" />
          Compartilhar
        </Button>
      </PopoverTrigger>

      <PopoverContent
        align="start"
        className="w-80 p-3 rounded-xl border-border"
      >
        <div className="space-y-3">
          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] font-black text-foreground">
              Compartilhar perfil
            </p>
            <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
              {shareText}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {socialLinks.map((item) => (
              <a
                key={item.key}
                href={item.href}
                target="_blank"
                rel="noreferrer noopener"
                className="inline-flex items-center justify-center gap-2 h-9 rounded-lg border border-border bg-muted text-xs font-semibold text-foreground hover:border-primary/40 hover:bg-primary/10 transition-colors"
              >
                {item.icon}
                {item.label}
              </a>
            ))}
          </div>

          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              className="flex-1 h-9 text-xs font-bold"
              onClick={handleCopy}
            >
              <Link2 className="h-4 w-4 mr-2" />
              {copied ? "Link copiado" : "Copiar link"}
            </Button>

            {isNativeShareSupported && (
              <Button
                type="button"
                className="flex-1 h-9 text-xs font-bold"
                onClick={handleNativeShare}
              >
                <Share2 className="h-4 w-4 mr-2" />
                Mais opções
              </Button>
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
