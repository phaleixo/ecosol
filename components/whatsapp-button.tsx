"use client";

import * as React from "react";
import { Button } from "./ui/button";
import { MessageCircle, Loader2 } from "lucide-react";

interface WhatsAppButtonProps {
  phone: string;
  providerEmail: string;
}

export default function WhatsAppButton({ phone, providerEmail }: WhatsAppButtonProps) {
  const [loading, setLoading] = React.useState(false);

  const formatWhatsAppLink = (rawPhone: string) => {
    // 1. Remove tudo que não for número
    let cleaned = rawPhone.replace(/\D/g, "");

    // 2. Se o número tiver 10 ou 11 dígitos (DDD + Número), adiciona o DDI 55 do Brasil
    if (cleaned.length >= 10 && cleaned.length <= 11) {
      cleaned = `55${cleaned}`;
    }

    return `https://wa.me/${cleaned}`;
  };

  const handleWhatsAppClick = async () => {
    setLoading(true);
    const whatsappUrl = formatWhatsAppLink(phone);

    try {
      // 1. Notificação de interesse
      await fetch("/api/notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ providerEmail }),
      });

      // 2. Redirecionamento
      window.open(whatsappUrl, "_blank");
    } catch (error) {
      console.error("Erro na notificação:", error);
      // Mesmo com erro na notificação, ainda redireciona o usuário
      window.open(whatsappUrl, "_blank");
    } finally {
      setTimeout(() => setLoading(false), 1000);
    }
  };

  return (
    <Button 
      onClick={handleWhatsAppClick} 
      disabled={loading}
      className="w-full bg-green-600 hover:bg-green-700 h-12 text-lg font-bold rounded-xl flex gap-2 transition-all active:scale-[0.98]"
    >
      {loading ? (
        <Loader2 className="h-5 w-5 animate-spin" />
      ) : (
        <MessageCircle className="h-5 w-5 fill-white/10" />
      )}
      {loading ? "Conectando..." : "Chamar no WhatsApp"}
    </Button>
  );
}