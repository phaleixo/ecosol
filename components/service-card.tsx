// components/service-cards.tsx
"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useRef, useState, useEffect } from "react";
import ContactIcons from "./contact-icons";
import { 
  Card, 
  CardContent, 
  CardImageContainer,
  CardTitleDescription,
  CardFooter,
  CardCategory,
  CardProfileIndicator
} from "./ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type Service = {
  id: string;
  name: string;
  image?: string | null;
  description?: string | null;
  category?: string | null;
  whatsapp?: string | null;
  instagram?: string | null;
  tiktok?: string | null;
  email?: string | null;
  site?: string | null;
};

export default function ServiceCard({
  service,
  eager,
}: {
  service: Service;
  eager?: boolean;
}) {
  const router = useRouter();
  const titleRef = useRef<HTMLHeadingElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const [needsTitleTooltip, setNeedsTitleTooltip] = useState(false);
  const [needsDescTooltip, setNeedsDescTooltip] = useState(false);

  // Função para verificar se o texto está truncado
  const isTextTruncated = (element: HTMLElement | null) => {
    if (!element) return false;
    return element.scrollWidth > element.clientWidth || 
           element.scrollHeight > element.clientHeight;
  };

  // Verificar se o texto está truncado após renderização
  useEffect(() => {
    const checkTruncation = () => {
      setNeedsTitleTooltip(isTextTruncated(titleRef.current));
      if (service.description) {
        setNeedsDescTooltip(isTextTruncated(descRef.current));
      }
    };

    // Verificar após um pequeno delay para garantir que o DOM está renderizado
    const timeoutId = setTimeout(checkTruncation, 0);
    window.addEventListener("resize", checkTruncation);
    
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener("resize", checkTruncation);
    };
  }, [service.description]);

  const handleCardClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest('a') || target.closest('button')) {
      return;
    }
    router.push(`/provider/${service.id}`);
  };

  return (
    <TooltipProvider>
      <Card 
        clickable
        onClick={handleCardClick}
        className="group"
      >
        <CardContent>
          <CardImageContainer>
            <Image
              src={service.image || "/ecosol-meta.png"}
              alt={service.name}
              fill
              sizes="(max-width: 640px) 100vw, 50vw"
              priority={eager}
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              style={{
                objectPosition: 'center center',
              }}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = "/ecosol-meta.png";
              }}
            />
          </CardImageContainer>

          <CardTitleDescription>
            {needsTitleTooltip ? (
              <Tooltip>
                <TooltipTrigger asChild>
                  <h3 
                    ref={titleRef}
                    className="text-sm md:text-base font-black text-foreground leading-tight uppercase tracking-tight line-clamp-2 group-hover:text-primary transition-colors duration-300 mb-1"
                  >
                    {service.name}
                  </h3>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs break-words">{service.name}</p>
                </TooltipContent>
              </Tooltip>
            ) : (
              <h3 
                ref={titleRef}
                className="text-sm md:text-base font-black text-foreground leading-tight uppercase tracking-tight line-clamp-2 group-hover:text-primary transition-colors duration-300 mb-1"
              >
                {service.name}
              </h3>
            )}
            
            {service.description && (
              needsDescTooltip ? (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <p 
                      ref={descRef}
                      className="text-[9px] md:text-[10px] text-muted-foreground line-clamp-2 leading-tight font-medium opacity-90 group-hover:opacity-100 transition-opacity duration-300"
                    >
                      {service.description}
                    </p>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs break-words">{service.description}</p>
                  </TooltipContent>
                </Tooltip>
              ) : (
                <p 
                  ref={descRef}
                  className="text-[9px] md:text-[10px] text-muted-foreground line-clamp-2 leading-tight font-medium opacity-90 group-hover:opacity-100 transition-opacity duration-300"
                >
                  {service.description}
                </p>
              )
            )}
          </CardTitleDescription>

          <CardFooter>
            <div className="flex items-center justify-between">
              <CardCategory>
                {service.category}
              </CardCategory>
              <CardProfileIndicator />
            </div>

            <div className="flex items-center pt-1">
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
          </CardFooter>
        </CardContent>
      </Card>
    </TooltipProvider>
  );
}