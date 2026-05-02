"use client";

import * as React from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ShieldCheck, FileText, Sun, Moon, Scale, HeartHandshake, Lock, Coins, Ban } from "lucide-react";

export default function TermsPage() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

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
        
        {/* CABEÇALHO */}
        <div className="flex flex-col items-center text-center space-y-4 pt-10">
          <div className="p-4 bg-primary/10 rounded-3xl text-primary shadow-inner">
            <Scale size={40} />
          </div>
          <h1 className="text-4xl font-black tracking-tighter uppercase leading-tight">
            Termos de Uso
          </h1>
          <p className="text-muted-foreground text-[10px] font-black uppercase tracking-[0.3em]">
            Compromisso Ético &bull; Rede Ecosol 2026
          </p>
        </div>

        {/* CORPO DOS TERMOS */}
        <div className="bg-card border border-border rounded-[2.5rem] p-8 md:p-12 shadow-2xl space-y-10 text-sm leading-relaxed relative overflow-hidden">
          
          <FileText className="absolute -bottom-10 -right-10 h-40 w-40 text-primary/5 -rotate-12" />

          {/* 1. NATUREZA */}
          <section className="space-y-4 relative">
            <h2 className="text-foreground font-black uppercase tracking-widest flex items-center gap-3 text-xs">
              <span className="h-1.5 w-1.5 bg-primary rounded-full shadow-[0_0_8px_rgba(var(--primary),0.8)]" /> 
              1. Natureza da Plataforma
            </h2>
            <p className="text-muted-foreground font-medium pl-4.5 border-l-2 border-border/50">
              A Ecosol é uma rede de economia solidária, sem fins lucrativos, desenvolvida por e para pessoas autistas. Nosso objetivo é fomentar a autonomia financeira e o apoio mútuo, conectando membros da comunidade para a troca, venda ou oferta de serviços e produtos.
            </p>
          </section>

          {/* 2. GRATUIDADE */}
          <section className="space-y-4 relative">
            <h2 className="text-foreground font-black uppercase tracking-widest flex items-center gap-3 text-xs">
              <span className="h-1.5 w-1.5 bg-primary rounded-full shadow-[0_0_8px_rgba(var(--primary),0.8)]" /> 
              2. Gratuidade
            </h2>
            <p className="text-muted-foreground font-medium pl-4.5 border-l-2 border-border/50">
              O acesso e o uso da plataforma são totalmente gratuitos. A Ecosol não cobra taxas de cadastro, mensalidades ou comissões sobre as vendas e trocas realizadas entre os usuários.
            </p>
          </section>

          {/* 3. LGPD - PRIVACIDADE */}
          <section className="space-y-4 relative">
            <h2 className="text-foreground font-black uppercase tracking-widest flex items-center gap-3 text-xs">
              <span className="h-1.5 w-1.5 bg-primary rounded-full shadow-[0_0_8px_rgba(var(--primary),0.8)]" /> 
              3. Privacidade e Proteção de Dados (LGPD)
            </h2>
            <div className="text-muted-foreground font-medium pl-4.5 border-l-2 border-border/50 space-y-3">
              <p>Em conformidade com a Lei Geral de Proteção de Dados (Lei nº 13.709/2018):</p>
              <ul className="space-y-2 list-none">
                <li className="flex gap-2">
                  <span className="text-primary font-bold">●</span>
                  <span><strong>Finalidade:</strong> Coletamos dados exclusivamente para viabilizar a conexão entre os usuários e a logística da rede.</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary font-bold">●</span>
                  <span><strong>Segurança:</strong> Seus dados não serão vendidos ou compartilhados com terceiros para fins publicitários.</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary font-bold">●</span>
                  <span><strong>Transparência:</strong> Informações sensíveis são tratadas com sigilo absoluto e utilizadas apenas para garantir a integridade da comunidade.</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary font-bold">●</span>
                  <span><strong>Controle:</strong> O usuário tem o direito de acessar, corrigir ou excluir seus dados a qualquer momento via suporte ou perfil.</span>
                </li>
              </ul>
            </div>
          </section>

          {/* 4. RESPONSABILIDADES */}
          <section className="space-y-4 relative">
            <h2 className="text-foreground font-black uppercase tracking-widest flex items-center gap-3 text-xs">
              <span className="h-1.5 w-1.5 bg-primary rounded-full shadow-[0_0_8px_rgba(var(--primary),0.8)]" /> 
              4. Responsabilidades nas Transações
            </h2>
            <p className="text-muted-foreground font-medium pl-4.5 border-l-2 border-border/50">
              A Ecosol atua apenas como uma vitrine de anúncios (intermediação). Preços, prazos e pagamentos são combinados diretamente entre os usuários. Não nos responsabilizamos por inadimplências ou defeitos, reservando-nos apenas o direito de banir usuários que ajam de má-fé.
            </p>
          </section>

          {/* 5. CÓDIGO DE CONDUTA */}
          <section className="space-y-4 relative">
            <h2 className="text-foreground font-black uppercase tracking-widest flex items-center gap-3 text-xs">
              <span className="h-1.5 w-1.5 bg-primary rounded-full shadow-[0_0_8px_rgba(var(--primary),0.8)]" /> 
              5. Código de Conduta (Segurança Emocional)
            </h2>
            <div className="text-muted-foreground font-medium pl-4.5 border-l-2 border-border/50 space-y-2">
              <p><strong>Capacitismo Zero:</strong> Proibida qualquer manifestação de preconceito contra pessoas autistas.</p>
              <p><strong>Respeito Mútuo:</strong> Comunicação agressiva ou discursos de ódio resultarão em exclusão imediata.</p>
            </div>
          </section>

          {/* 6. PROPRIEDADE INTELECTUAL */}
          <section className="space-y-4 relative">
            <h2 className="text-foreground font-black uppercase tracking-widest flex items-center gap-3 text-xs">
              <span className="h-1.5 w-1.5 bg-primary rounded-full shadow-[0_0_8px_rgba(var(--primary),0.8)]" /> 
              6. Propriedade Intelectual
            </h2>
            <p className="text-muted-foreground font-medium pl-4.5 border-l-2 border-border/50">
              O usuário é o único responsável pelo conteúdo (fotos e textos) que publica. Ao publicar na Ecosol, você autoriza a exibição desses materiais dentro da plataforma.
            </p>
          </section>

          {/* 7. ALTERAÇÕES */}
          <section className="space-y-4 relative">
            <h2 className="text-foreground font-black uppercase tracking-widest flex items-center gap-3 text-xs">
              <span className="h-1.5 w-1.5 bg-primary rounded-full shadow-[0_0_8px_rgba(var(--primary),0.8)]" /> 
              7. Alterações nos Termos
            </h2>
            <p className="text-muted-foreground font-medium pl-4.5 border-l-2 border-border/50">
              Reservamo-nos o direito de atualizar estes termos para refletir melhorias na rede. O uso continuado após alterações significará a aceitação dos novos termos.
            </p>
          </section>

          <div className="pt-6 text-[10px] text-muted-foreground/50 font-black uppercase tracking-widest text-center border-t border-border">
            Última atualização: 15 de Janeiro de 2026
          </div>
        </div>

        {/* AÇÃO DE RETORNO */}
        <div className="flex justify-center pb-10">
          <Link href="/signup">
            <Button variant="ghost" className="gap-3 font-black uppercase text-[10px] tracking-widest hover:bg-primary/10 hover:text-primary transition-all rounded-2xl px-8 h-12">
              <ArrowLeft size={14} /> Voltar para o Cadastro
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}