import prisma from "@/lib/prisma";
import Header from "@/components/header";
import LiveSearchContainer from "@/components/live-search-container";

// Forçamos o Next.js a ignorar qualquer cache de rota ou de dados
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

export default async function Home({ searchParams }: { searchParams: Promise<{ category?: string }> }) {
  await searchParams;

  /**
   * 1. LOGÍSTICA DE DADOS PARALELA
   * Executamos as contagens e a busca randômica simultaneamente para reduzir o TTFB (Time to First Byte).
   */
  const [counts, total, initialServices] = await Promise.all([
    // Contagem por categoria (mantida para o filtro)
    prisma.service.groupBy({
      by: ['category'],
      where: { approved: true, suspended: false, deletedAt: null },
      _count: { category: true },
      orderBy: { category: 'asc' }
    }),
    
    // Total de registros
    prisma.service.count({
      where: { approved: true, suspended: false, deletedAt: null }
    }),

    /**
     * 2. BUSCA RANDÔMICA (SQL NATIVO)
     * Utilizamos ORDER BY RANDOM() para que o PostgreSQL embaralhe os resultados
     * antes de nos entregar os 12 primeiros.
     */
    prisma.$queryRaw<any[]>`
      SELECT * FROM "Service"
      WHERE approved = true 
        AND suspended = false 
        AND "deletedAt" IS NULL
      ORDER BY RANDOM()
      LIMIT 12
    `
  ]);

  /**
   * 3. MAPEAMENTO DE CATEGORIAS
   */
  const categoriesWithCounts = [
    { name: "Todas", count: total },
    ...counts.map((c: { category: any; _count: { category: any; }; }) => ({ name: c.category, count: c._count.category }))
  ];

  return (
    <div className="min-h-screen bg-background text-foreground pb-10 transition-colors duration-300">
      <Header />
      
      <main className="mx-auto max-w-6xl px-6 py-4">
        {/* Passamos os serviços já embaralhados pelo servidor.
          Cada refresh resultará em uma ordem e seleção única.
        */}
        <LiveSearchContainer 
          initialServices={initialServices} 
          categories={categoriesWithCounts} 
        />
      </main>
    </div>
  );
}