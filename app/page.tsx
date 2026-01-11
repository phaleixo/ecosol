import Header from "../components/header";
import SearchBar from "../components/search-bar";
import CategoryFilter from "../components/category-filter";
import ServiceCard from "../components/service-card";
import prisma from "../lib/prisma";

type Service = {
  id: number;
  [key: string]: unknown;
};

export default async function Home() {
  const services: Service[] = await prisma.service.findMany({
    where: { approved: true, suspended: false },
    orderBy: { createdAt: "desc" },
    take: 12,
  });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Header />
      <main className="mx-auto max-w-6xl p-6">
        <section className="py-4 text-center">
          <h1 className="text-4xl font-bold">
            Economia Solidaria entre Autistas
          </h1>
          <p className="mt-2 text-slate-600">
            Encontre e contrate profissionais prestadores de serviços qualificados em diversas áreas.
          </p>
          <div className="mt-6 flex items-center justify-center">
            <SearchBar />
          </div>
        </section>

        <section className="mt-6">
          <CategoryFilter />
        </section>

        <section className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s: Service) => (
            <ServiceCard key={s.id} service={s} />
          ))}
        </section>

        <div className="mt-8 flex justify-center"></div>
      </main>
    </div>
  );
}
