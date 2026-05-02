"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import SearchBar from "./search-bar";
import ServiceCard from "./service-card";
import CategoryFilter from "./category-filter";
import ServiceSkeleton from "./service-skeleton";
import { Pagination } from "./ui/pagination";

type ServiceItem = {
  id: string;
  name: string;
  category: string;
  description?: string | null;
  image?: string | null;
  whatsapp?: string | null;
  instagram?: string | null;
  tiktok?: string | null;
  views?: number;
  email?: string | null;
  approved?: boolean;
  suspended?: boolean;
  [key: string]: unknown;
};

interface CategoryData {
  name: string;
  count: number;
}

export default function LiveSearchContainer({
  initialServices,
  categories,
}: {
  initialServices: ServiceItem[];
  categories: CategoryData[];
}) {
  // Inicializamos os dados vindos do servidor (já embaralhados)
  const masterOrder = React.useMemo(() => initialServices, [initialServices]);
  const [services, setServices] = React.useState<ServiceItem[]>(
    () => initialServices,
  );
  const [searchTerm, setSearchTerm] = React.useState("");
  const [selectedCategory, setSelectedCategory] = React.useState("Todas");
  const [isSearching, setIsSearching] = React.useState(false);
  const [isInitialPageLoad, setIsInitialPageLoad] = React.useState(true);
  const [searchError, setSearchError] = React.useState<string | null>(null);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [itemsPerPageState] = React.useState(6);
  const itemsPerPage = services.length || itemsPerPageState;

  const containerRef = React.useRef<HTMLDivElement>(null);
  const topAnchorRef = React.useRef<HTMLDivElement>(null);
  const lastUpdateIds = React.useRef<string>("");
  const abortControllerRef = React.useRef<AbortController | null>(null);

  // 1. Configuração de Scroll do Navegador
  React.useEffect(() => {
    if ("scrollRestoration" in history) {
      history.scrollRestoration = "manual";
    }
  }, []);

  // 3. Controle de carregamento inicial
  React.useEffect(() => {
    const timer = setTimeout(() => setIsInitialPageLoad(false), 800);
    return () => clearTimeout(timer);
  }, []);

  // 4. Lógica de Scroll Determinística
  React.useEffect(() => {
    if (!isInitialPageLoad) {
      requestAnimationFrame(() => {
        if (topAnchorRef.current) {
          const yOffset = -120;
          const y =
            topAnchorRef.current.getBoundingClientRect().top +
            window.pageYOffset +
            yOffset;
          window.scrollTo({ top: y, behavior: "smooth" });
        }
      });
    }
  }, [currentPage, isInitialPageLoad]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSearchChange = (term: string) => {
    setSearchTerm(term);
    setCurrentPage(1);
  };

  // 6. Busca e filtragem integral (Engenharia Preservada)
  React.useEffect(() => {
    const performUpdate = async () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      const newAbortController = new AbortController();
      abortControllerRef.current = newAbortController;

      const normalizedSearch = searchTerm.toLowerCase().trim();

      const localFiltered = masterOrder.filter((service) => {
        const matchesCategory =
          selectedCategory === "Todas" || service.category === selectedCategory;
        const matchesSearch =
          !normalizedSearch ||
          service.name.toLowerCase().includes(normalizedSearch) ||
          service.category.toLowerCase().includes(normalizedSearch) ||
          (service.description &&
            service.description.toLowerCase().includes(normalizedSearch));

        return matchesCategory && matchesSearch;
      });

      const currentIds = localFiltered
        .map((s) => s.id)
        .sort()
        .join(",");

      if (currentIds !== lastUpdateIds.current) {
        setServices(localFiltered);
        lastUpdateIds.current = currentIds;
      }

      const needsRemoteSync = searchTerm !== "" || selectedCategory !== "Todas";

      if (needsRemoteSync) {
        setIsSearching(true);
        setSearchError(null);

        try {
          const queryParams = new URLSearchParams({
            q: searchTerm,
            category: selectedCategory,
          });

          const response = await fetch(
            `/api/search?${queryParams.toString()}`,
            {
              signal: newAbortController.signal,
            },
          );

          if (!response.ok) throw new Error("Falha na resposta do servidor");

          const serverData: ServiceItem[] = await response.json();

          const sortedServerData = [...serverData].sort((a, b) => {
            const indexA = masterOrder.findIndex((m) => m.id === a.id);
            const indexB = masterOrder.findIndex((m) => m.id === b.id);
            if (indexA === -1) return 1;
            if (indexB === -1) return -1;
            return indexA - indexB;
          });

          const serverIds = sortedServerData
            .map((s) => s.id)
            .sort()
            .join(",");

          if (serverIds !== lastUpdateIds.current) {
            setServices(sortedServerData);
            lastUpdateIds.current = serverIds;
          }
        } catch (err: unknown) {
          const name =
            typeof err === "object" &&
            err !== null &&
            "name" in err &&
            typeof (err as { name?: unknown }).name === "string"
              ? (err as { name: string }).name
              : undefined;
          if (name !== "AbortError") {
            console.error("Erro na busca remota:", err);
            setSearchError("Não foi possível sincronizar os dados.");
          }
        } finally {
          setIsSearching(false);
        }
      } else {
        const masterIds = masterOrder
          .map((s) => s.id)
          .sort()
          .join(",");
        if (lastUpdateIds.current !== masterIds) {
          setServices(masterOrder);
          lastUpdateIds.current = masterIds;
        }
      }
    };

    const debounceTime = searchTerm ? 400 : 0;
    const timeoutId = setTimeout(performUpdate, debounceTime);

    return () => {
      clearTimeout(timeoutId);
      if (abortControllerRef.current) abortControllerRef.current.abort();
    };
  }, [searchTerm, selectedCategory, masterOrder]);

  const totalItems = services.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const safeCurrentPage =
    totalPages > 0 ? Math.min(currentPage, totalPages) : 1;
  const startIndex = (safeCurrentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  const paginatedServices = services.slice(startIndex, endIndex);

  return (
    <div className="w-full flex flex-col transition-colors duration-300">
      <div ref={topAnchorRef} className="scroll-mt-24" />

      <section className="flex flex-col items-center py-3 gap-3">
        <div className="text-center space-y-0">
          <h1 className="text-2xl font-bold text-foreground tracking-tighter uppercase leading-tight">
            Economia Solidária
            <p className="text-primary text-xl leading-tight">Entre Autistas</p>
          </h1>
        </div>
        <div className="w-full max-w-md px-4">
          <SearchBar onSearch={handleSearchChange} />
        </div>
      </section>

      <div className="py-2 border-b border-border">
        <CategoryFilter
          categories={categories}
          activeCategory={selectedCategory}
          onSelect={(cat) => {
            setSelectedCategory(cat);
            handlePageChange(1);
          }}
        />
      </div>

      <div
        ref={containerRef}
        className="mt-3 mb-6"
        style={{ overflowAnchor: "none" }}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5 min-h-[400px]">
          <AnimatePresence mode="popLayout" initial={false}>
            {isInitialPageLoad ? (
              Array.from({ length: itemsPerPage }).map((_, i) => (
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
                initial={{ opacity: 0, translateY: 20 }}
                animate={{ opacity: 1, translateY: 0 }}
                exit={{ opacity: 0, translateY: -20 }}
                className="col-span-full text-center py-12 bg-card rounded-xl border border-dashed border-border"
              >
                <div className="text-3xl mb-3 grayscale opacity-30">🔍</div>
                <p className="text-muted-foreground font-black text-[10px] uppercase tracking-[0.3em]">
                  {searchError || "Nenhum resultado encontrado para sua busca"}
                </p>
              </motion.div>
            ) : (
              paginatedServices.map((service) => (
                <motion.div
                  key={service.id}
                  layout="position"
                  initial={{ opacity: 1 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ServiceCard service={service} />
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </div>

      {totalPages > 1 && (
        <Pagination
          currentPage={safeCurrentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          isSearching={isSearching}
        />
      )}
    </div>
  );
}
