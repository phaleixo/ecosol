"use client";
import * as React from "react";
import SearchBar from "./search-bar";
import ServiceCard from "./service-card";
import CategoryFilter from "./category-filter";
import ServiceSkeleton from "./service-skeleton";

export default function LiveSearchContainer({ 
  initialServices, 
  categories 
}: { 
  initialServices: any[], 
  categories: any[] 
}) {
  const [services, setServices] = React.useState(initialServices);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [selectedCategory, setSelectedCategory] = React.useState("Todas");
  const [isSearching, setIsSearching] = React.useState(false);

  React.useEffect(() => {
    const fetchData = async () => {
      setIsSearching(true);
      try {
        const query = new URLSearchParams({ q: searchTerm, category: selectedCategory });
        const res = await fetch(`/api/search?${query.toString()}`);
        if (res.ok) setServices(await res.json());
      } catch (err) { console.error("Erro busca:", err); }
      finally { setIsSearching(false); }
    };
    const timeoutId = setTimeout(fetchData, searchTerm ? 400 : 0);
    return () => clearTimeout(timeoutId);
  }, [searchTerm, selectedCategory]);

  return (
    <div className="w-full flex flex-col">
      {/* 1. Hero: py-2 e gap-3 para reduzir a altura do topo */}
      <section className="flex flex-col items-center py-2 gap-3">
        <div className="text-center space-y-0">
          <h1 className="text-2xl font-black text-slate-900 tracking-tighter uppercase leading-none">
            Economia Solidária
          </h1>
          <p className="text-blue-600 text-[8px] font-black uppercase tracking-[0.4em] mt-1">
            Entre Autistas
          </p>
        </div>
        <SearchBar onSearch={setSearchTerm} />
      </section>

      {/* 2. Filtros: mb-0 remove o espaço entre botões e cards */}
      <div className="py-1 border-b border-slate-50 mb-0">
        <CategoryFilter 
          categories={categories} 
          activeCategory={selectedCategory} 
          onSelect={setSelectedCategory} 
        />
      </div>

      {/* 3. Grid: mt-1 para compactação máxima */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 mt-1">
        {isSearching ? (
          Array.from({ length: 6 }).map((_, i) => (
            <ServiceSkeleton key={i} />
          ))
        ) : services.length === 0 ? (
          <div className="col-span-full text-center py-16 bg-white rounded-[2.5rem] border border-dashed border-slate-100">
             <p className="text-slate-400 font-bold italic text-xs uppercase tracking-widest">
               Nenhum resultado
             </p>
          </div>
        ) : (
          services.map((service) => (
            <div key={service.id} className="animate-in fade-in duration-300">
              <ServiceCard service={service} />
            </div>
          ))
        )}
      </div>
    </div>
  );
}