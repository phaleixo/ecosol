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
  const [services, setServices] = React.useState<Service[]>(() => shuffleArray(initialServices));
  const [searchTerm, setSearchTerm] = React.useState("");
  const [selectedCategory, setSelectedCategory] = React.useState("Todas");
  const [isSearching, setIsSearching] = React.useState(false);
  const [isInitialPageLoad, setIsInitialPageLoad] = React.useState(true);

  // Referência para evitar o "duplo pulo"
  const lastUpdateIds = React.useRef<string>("");

  React.useEffect(() => {
    const timer = setTimeout(() => setIsInitialPageLoad(false), 800);
    return () => clearTimeout(timer);
  }, []);

  React.useEffect(() => {
    // 1. FILTRAGEM E SHUFFLE ÚNICO (Imediato)
    const performUpdate = async () => {
      // Filtragem local para resposta instantânea
      let localFiltered = initialServices.filter(s => {
        const matchesCategory = selectedCategory === "Todas" || s.category === selectedCategory;
        const matchesSearch = !searchTerm || 
          s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          s.category.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesCategory && matchesSearch;
      });

      // Geramos a string de IDs para comparar se a lista realmente mudou
      const currentIds = localFiltered.map(s => s.id).sort().join(",");

      // Só atualizamos e embaralhamos se a lista de IDs mudou
      if (currentIds !== lastUpdateIds.current) {
        setServices(shuffleArray(localFiltered));
        lastUpdateIds.current = currentIds;
      }

      // 2. SINCRONIZAÇÃO COM SERVIDOR (Em segundo plano, sem re-shuffle se for igual)
      if (searchTerm || selectedCategory !== "Todas") {
        if (searchTerm) setIsSearching(true);
        
        try {
          const query = new URLSearchParams({ q: searchTerm, category: selectedCategory });
          const res = await fetch(`/api/search?${query.toString()}`);
          if (res.ok) {
            const serverData: Service[] = await res.json();
            const serverIds = serverData.map(s => s.id).sort().join(",");
            
            // SÓ atualizamos o estado se o servidor trouxer algo diferente do que já filtramos localmente
            // Isso evita o "segundo movimento" errático
            if (serverIds !== lastUpdateIds.current) {
              setServices(shuffleArray(serverData));
              lastUpdateIds.current = serverIds;
            }
          }
        } catch (err) {
          console.error("Erro busca:", err);
        } finally {
          setIsSearching(false);
        }
      } else {
        // Se voltou para "Todas" e sem busca, apenas garante o shuffle inicial estável
        const initialIds = initialServices.map(s => s.id).sort().join(",");
        if (initialIds !== lastUpdateIds.current) {
          setServices(shuffleArray(initialServices));
          lastUpdateIds.current = initialIds;
        }
      }
    };

    const delay = searchTerm ? 400 : 0;
    const timeoutId = setTimeout(performUpdate, delay);
    return () => clearTimeout(timeoutId);
  }, [searchTerm, selectedCategory, initialServices]);

  return (
    <div className="w-full flex flex-col transition-colors duration-300">
      
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

      <div className="py-1 border-b border-border mb-0">
        <CategoryFilter
          categories={categories}
          activeCategory={selectedCategory}
          onSelect={setSelectedCategory}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 mt-4 relative">
        <AnimatePresence mode="popLayout">
          {isInitialPageLoad ? (
            Array.from({ length: 6 }).map((_, i) => (
              <motion.div key={`skeleton-${i}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
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
                key={service.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ 
                  opacity: isSearching ? 0.6 : 1, 
                  scale: 1 
                }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{
                  // Ajustado para um movimento mais "Gentle" (suave) e menos "Snappy" (brusco)
                  // Ideal para acessibilidade neurodivergente (evita movimentos súbitos)
                  type: "spring",
                  stiffness: 150, 
                  damping: 25,
                  mass: 1,
                  layout: { duration: 0.4 }
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