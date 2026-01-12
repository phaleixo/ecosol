"use client";
import { Service } from "@prisma/client";
import { Button } from "./ui/button";
import Link from "next/link";
import ContactIcons from "./contact-icons";

export default function ServiceCard({ service }: { service: Service }) {
  return (
    <div className="group bg-white rounded-2xl shadow-sm border p-5 flex flex-col h-full hover:shadow-md transition-all duration-300">
      {/* Imagem do Card */}
      <div className="relative aspect-video rounded-xl bg-slate-100 overflow-hidden border">
        {service.image ? (
          <img
            src={service.image}
            alt={service.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-300 text-4xl">
            🏢
          </div>
        )}
      </div>

      {/* Conteúdo Informativo */}
      <div className="mt-4 flex-1">
        <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest px-2 py-0.5 bg-blue-50 rounded-md">
          {service.category}
        </span>
        <h3 className="text-xl font-bold text-slate-900 mt-2">{service.name}</h3>

        {/* Descrição com Limitador de Linhas (Line Clamp) */}
        {service.description ? (
          <p className="text-slate-500 text-sm mt-2 line-clamp-2 leading-relaxed">
            {service.description}
          </p>
        ) : (
          <p className="text-slate-400 text-xs mt-2 italic">
            Sem descrição disponível.
          </p>
        )}
      </div>

      {/* Rodapé do Card */}
      <div className="mt-6 pt-4 border-t flex items-center justify-between">
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
          <Button variant="ghost" size="sm" className="text-blue-600 font-bold hover:text-blue-700 hover:bg-blue-50">
            Ver Perfil
          </Button>
        </Link>
      </div>
    </div>
  );
}