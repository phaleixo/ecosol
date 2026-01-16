"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import SearchBar from "./search-bar";
import ServiceCard from "./service-card";
import CategoryFilter from "./category-filter";
import ServiceSkeleton from "./service-skeleton";
import { Service } from "@prisma/client";

interface CategoryData {
  name: string;
  count: number;
}

// Função Utilitária para embaralhar o array
const shuffleArray = (array: any[]) => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

export default function LiveSearchContainer({
  initialServices,
  categories,
}: {
  initialServices: Service[];
  categories: CategoryData[];
}) {
  // Inicializamos o estado já com um shuffle dos dados iniciais
  const [services, setServices] = React.useState<Service[]>(() => shuffleArray(initialServices));
  const [searchTerm, setSearchTerm] = React.useState("");
  const [selectedCategory, setSelectedCategory] = React.useState("Todas");
  const [isSearching, setIsSearching] = React.useState(false);
  const [isInitialPageLoad, setIsInitialPageLoad] = React.useState(true);

  React.useEffect(() => {
    const timer = setTimeout(() => setIsInitialPageLoad(false), 800);
    return () => clearTimeout(timer);
  }, []);

  React.useEffect(() => {
    const fetchData = async () => {
      // Se não há busca e é "Todas", usamos o initialServices embaralhado
      if (!searchTerm && selectedCategory === "Todas") {
        setServices(shuffleArray(initialServices));
        return;
      }

      setIsSearching(true);
      try {
        const query = new URLSearchParams({
          q: searchTerm,
          category: selectedCategory,
        });
        const res = await fetch(`/api/search?${query.toString()}`);
        if (res.ok) {
          const data = await res.json();
          // Aplicamos o shuffle nos dados que vem da API
          setServices(shuffleArray(data));
        }
      } catch (err) {
        console.error("Erro busca:", err);
      } finally {
        setIsSearching(false);
      }
    };

    // Delay de debounce para a busca
    const timeoutId = setTimeout(fetchData, searchTerm ? 400 : 0);
    return () => clearTimeout(timeoutId);
  }, [searchTerm, selectedCategory, initialServices]);

  return (
    <div className="w-full flex flex-col transition-colors duration-300">
      
      {/* 1. Hero / Search Area */}
      <section className="flex flex-col items-center py-2 gap-3">
        <div className="text-center space-y-0">
          <h1 className="text-2xl font-bold text-foreground tracking-tighter uppercase leading-none">
            Economia Solidária
            <p className="text-primary text-xl"> Entre Autistas</p>
          </h1>
        </div>
        <div className="w-full max-w-md">
          <SearchBar onSearch={setSearchTerm} />
        </div>
      </section>

      {/* 2. Filtros */}
      <div className="py-1 border-b border-border mb-0">
        <CategoryFilter
          categories={categories}
          activeCategory={selectedCategory}
          onSelect={setSelectedCategory}
        />
      </div>

      {/* 3. Grid com Shuffle Animado */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 mt-4 relative">
        <AnimatePresence mode="popLayout">
          {isInitialPageLoad ? (
            Array.from({ length: 6 }).map((_, i) => (
              <motion.div 
                key={`skeleton-${i}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <ServiceSkeleton />
              </motion.div>
            ))
          ) : services.length === 0 && !isSearching ? (
            <motion.div 
              key="empty-state"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="col-span-full text-center py-16 bg-card rounded-[2.5rem] border border-dashed border-border"
            >
              <div className="text-3xl mb-3 grayscale opacity-30">🔍</div>
              <p className="text-muted-foreground font-black text-[10px] uppercase tracking-[0.3em]">
                Nenhum resultado encontrado
              </p>
            </motion.div>
          ) : (
            services.map((service) => (
              <motion.div
                key={service.id} // O ID estável permite que o Framer Motion saiba quem mover
                layout // Ativa a animação de reordenamento automático
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ 
                  opacity: isSearching ? 0.5 : 1,
                  scale: 1 
                }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{
                  type: "spring",
                  stiffness: 350,
                  damping: 25,
                  layout: { duration: 0.5 }
                }}
              >
                <ServiceCard service={service} />
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}