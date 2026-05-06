"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { HeartHandshake, Book, Sun, Moon, ArrowLeft } from "lucide-react";

export default function WhatPage() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  React.useEffect(() => setMounted(true), []);

  return (
    <div className="min-h-screen bg-background text-foreground p-6 md:p-12 transition-colors duration-500">
      <button
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        className="fixed top-6 right-6 p-3 bg-card border border-border rounded-2xl shadow-lg hover:scale-110 active:scale-95 transition-all text-primary z-50"
      >
        {mounted && (theme === "dark" ? <Sun size={20} /> : <Moon size={20} />)}
      </button>

      <div className="max-w-3xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="flex flex-col items-center text-center space-y-4 pt-10">
          <div className="p-4 bg-primary/10 rounded-3xl text-primary shadow-inner">
            <HeartHandshake size={40} />
          </div>
          <h1 className="text-4xl font-black tracking-tighter uppercase leading-tight">
            O que é Economia Solidária?
          </h1>
          <p className="text-muted-foreground text-[10px] font-black uppercase tracking-[0.3em]">
            Práticas colaborativas para trabalho, renda e cuidado coletivo
          </p>
        </div>

        <div className="bg-card border border-border rounded-[2.5rem] p-8 md:p-12 shadow-2xl space-y-10 text-sm leading-relaxed relative overflow-hidden">
          <Book className="absolute -bottom-10 -right-10 h-40 w-40 text-primary/5 -rotate-12" />

          <section className="space-y-4 relative">
            <h2 className="text-foreground font-black uppercase tracking-widest flex items-center gap-3 text-xs">
              <span className="h-1.5 w-1.5 bg-primary rounded-full" />
              1. Definição
            </h2>
            <p className="text-muted-foreground font-medium pl-4.5 border-l-2 border-border/50">
              Economia solidária é um conjunto de práticas econômicas que
              priorizam a cooperação, a gestão coletiva e o bem-estar social em
              vez do lucro individual. Inclui cooperativas, redes de troca,
              serviços comunitários e iniciativas que valorizam a autonomia e a
              participação democrática.
            </p>
          </section>

          <section className="relative py-2 md:py-4">
            <div className="relative mx-auto aspect-[16/9] w-full max-w-2xl overflow-hidden rounded-[1.5rem] bg-transparent">
              <Image
                src="/lampada.png"
                alt="Lâmpada simbolizando ideias e colaboração"
                fill
                className="object-contain p-4"
                sizes="(max-width: 768px) 100vw, 768px"
                priority
              />
            </div>
            <p className="mt-3 text-center text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/60">
              Inclusão • Oportunidade • Independência • Colaboração
            </p>
          </section>

          <section className="space-y-4 relative">
            <h2 className="text-foreground font-black uppercase tracking-widest flex items-center gap-3 text-xs">
              <span className="h-1.5 w-1.5 bg-primary rounded-full" />
              2. Por que é importante para grupos autistas
            </h2>
            <div className="text-muted-foreground font-medium pl-4.5 border-l-2 border-border/50 space-y-3">
              <p>
                <strong>Autonomia econômica:</strong> Oferece caminhos para
                geração de renda controlados pelos próprios participantes,
                reduzindo dependência de modelos formais que nem sempre acomodam
                necessidades sensoriais e comunicativas.
              </p>
              <p>
                <strong>Ambientes adaptáveis:</strong> Cooperativas e redes
                locais permitem ajustar ritmos, prazos e formas de comunicação,
                tornando o trabalho mais compatível com variações sensoriais e
                de processamento.
              </p>
              <p>
                <strong>Apoio mútuo e redes de cuidado:</strong> A lógica da
                reciprocidade facilita que membros ofereçam suporte prático e
                emocional, fortalecendo laços e oportunidades de aprendizagem.
              </p>
              <p>
                <strong>Valorização de habilidades diversas:</strong> Economia
                solidária reconhece formas alternativas de contribuir (serviços,
                artes, consultoria, microempreendimentos), ampliando
                oportunidades para talentos frequentemente subestimados.
              </p>
            </div>
          </section>

          <section className="space-y-4 relative">
            <h2 className="text-foreground font-black uppercase tracking-widest flex items-center gap-3 text-xs">
              <span className="h-1.5 w-1.5 bg-primary rounded-full" />
              3. Como participar na Ecosol
            </h2>
            <div className="text-muted-foreground font-medium pl-4.5 border-l-2 border-border/50 space-y-2">
              <p>
                Cadastre-se, crie anúncios dos seus serviços ou produtos, e
                conecte-se com uma rede que prioriza inclusão e ajuste mútuo.
                Procuramos facilitar comunicação clara, opções de contato
                alternativas e apoio da comunidade.
              </p>
              <div className="pt-4 flex gap-3">
                <Link href="/signup">
                  <Button
                    variant="secondary"
                    className="font-black uppercase text-[10px] tracking-widest"
                  >
                    Criar Conta
                  </Button>
                </Link>
                
              </div>
            </div>
          </section>

          <div className="pt-6 text-[10px] text-muted-foreground/50 font-black uppercase tracking-widest text-center border-t border-border">
            Última atualização: 02 de Maio de 2026
          </div>
        </div>

        <div className="flex justify-center pb-10">
          <Link href="/">
            <Button
              variant="ghost"
              className="gap-3 font-black uppercase text-[10px] tracking-widest hover:bg-primary/10 hover:text-primary transition-all rounded-2xl px-8 h-12"
            >
              <ArrowLeft size={14} /> Voltar ao Início
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
