"use client";
import { Service } from "@prisma/client";
import { Button } from "./ui/button";
import Link from "next/link";
import ContactIcons from "./contact-icons";
import { Card } from "./ui/card";
import { ArrowUpRight } from "lucide-react";

export default function ServiceCard({ service }: { service: Service }) {
  return (
    <Card className="flex flex-col h-full border-slate-100 hover:border-blue-200 transition-all duration-300 p-3.5 shadow-sm group">
      {/* Imagem compacta */}
      <div className="relative aspect-video rounded-[1.6rem] bg-slate-50 overflow-hidden border border-slate-50 mb-2.5">
        <img
          src={service.image || "/placeholder.png"}
          alt={service.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>

      {/* Título e descrição colados */}
      <div className="flex-1 px-0.5">
        <h3 className="text-base font-black text-slate-900 leading-tight uppercase tracking-tight">
          {service.name}
        </h3>
        {service.description && (
          <p className="text-slate-500 text-[10px] line-clamp-2 leading-tight font-medium mt-0.5 opacity-90">
            {service.description}
          </p>
        )}
      </div>

      {/* Rodapé: mt-2 e gap-2 para eliminar espaços vazios */}
      <div className="mt-2 pt-2 border-t border-slate-50 space-y-2">
        <div className="flex">
          <span className="text-[7px] font-black text-blue-500 uppercase tracking-[0.2em] px-2 py-0.5 bg-blue-50/50 rounded-md">
            {service.category}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <ContactIcons
            contacts={{
              whatsapp: service.whatsapp ?? undefined,
              instagram: service.instagram ?? undefined,
              tiktok: service.tiktok ?? undefined,
              email: service.email ?? undefined,
              site: service.site ?? undefined,
            }}
          />
          <Link href={`/provider/${service.id}`}>
            <Button variant="ghost" className="h-7 px-3 rounded-lg text-blue-600 font-black text-[9px] uppercase tracking-widest">
              Perfil <ArrowUpRight className="ml-1 h-3 w-3" />
            </Button>
          </Link>
        </div>
      </div>
    </Card>
  );
}