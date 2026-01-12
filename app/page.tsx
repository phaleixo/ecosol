import prisma from "@/lib/prisma";
import Header from "@/components/header";
import ServiceCard from "@/components/service-card";
import SearchBar from "@/components/search-bar";
import CategoryFilter from "@/components/category-filter";
import { Service } from "@prisma/client";

export default async function Home() {
  // Busca apenas serviços que foram aprovados pelo admin e não estão suspensos
  const services = await prisma.service.findMany({
    where: {
      approved: true,
      suspended: false,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Header />
      
      <main className="mx-auto max-w-6xl p-6">
        <section className="flex flex-col items-center text-center py-12 gap-4">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
            Economia Solidária <span className="text-blue-600">Entre Autistas</span>
          </h1>
          <p className="max-w-2xl text-lg text-slate-600">
            Encontre e apoie empreendedores e profissionais da nossa comunidade.
          </p>
          
          <div className="mt-4 w-full flex justify-center">
            <SearchBar />
          </div>
        </section>

        <div className="space-y-8">
          <div className="flex flex-col gap-4">
            <h2 className="text-xl font-semibold">Categorias</h2>
            <CategoryFilter />
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.length === 0 ? (
              <div className="col-span-full py-20 text-center text-slate-500 border-2 border-dashed rounded-xl">
                Nenhum negócio aprovado ainda. 
                <br /> 
                Seja o primeiro a se cadastrar!
              </div>
            ) : (
              services.map((service: Service) => (
                <ServiceCard key={service.id} service={service} />
              ))
            )}
          </div>
        </div>
      </main>

      <footer className="mt-20 border-t bg-white py-10 text-center text-sm text-slate-500">
        &copy; {new Date().getFullYear()} Ecosol - Todos os direitos reservados.
      </footer>
    </div>
  );
}