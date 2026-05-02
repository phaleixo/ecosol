"use client";

import { useRef, useEffect, useState, useCallback } from "react";

interface CategoryData {
  name: string;
  count: number;
}

interface CategoryFilterProps {
  categories: CategoryData[];
  activeCategory: string;
  onSelect: (categoryName: string) => void;
}

export default function CategoryFilter({ categories, activeCategory, onSelect }: CategoryFilterProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [showLeftFade, setShowLeftFade] = useState(false);
  const [showRightFade, setShowRightFade] = useState(false);
  
  // Estado para controlar drag/scroll
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeftStart, setScrollLeftStart] = useState(0);
  const [dragDistance, setDragDistance] = useState(0);
  const [clickTarget, setClickTarget] = useState<string | null>(null);

  const checkScroll = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    const { scrollLeft, scrollWidth, clientWidth } = container;
    
    // Verifica se precisa mostrar os fades
    const hasOverflow = scrollWidth > clientWidth;
    
    if (hasOverflow) {
      const tolerance = 1;
      setShowLeftFade(scrollLeft > tolerance);
      setShowRightFade(scrollLeft < scrollWidth - clientWidth - tolerance);
    } else {
      setShowLeftFade(false);
      setShowRightFade(false);
    }
  }, []);

  // Inicialização
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    checkScroll();
    
    const handleScroll = () => checkScroll();
    const handleResize = () => checkScroll();
    
    container.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleResize);
    
    return () => {
      container.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, [checkScroll]);

  // Re-checa quando as categorias mudam
  useEffect(() => {
    const timer = setTimeout(checkScroll, 100);
    return () => clearTimeout(timer);
  }, [categories, checkScroll]);

  // Funções de drag/touch
  const handlePointerDown = (e: React.PointerEvent, categoryName?: string) => {
    const container = containerRef.current;
    if (!container) return;

    setIsDragging(true);
    setStartX(e.pageX);
    setScrollLeftStart(container.scrollLeft);
    setDragDistance(0);
    if (categoryName) setClickTarget(categoryName);
    
    container.style.cursor = 'grabbing';
    container.style.userSelect = 'none';
  };

  const handlePointerMove = useCallback((e: PointerEvent) => {
    if (!isDragging || !containerRef.current) return;
    
    e.preventDefault();
    const container = containerRef.current;
    
    const x = e.pageX - container.offsetLeft;
    const walk = (x - startX);
    setDragDistance(Math.abs(walk));
    
    // Aplica o scroll
    container.scrollLeft = scrollLeftStart - walk;
    
    checkScroll();
  }, [isDragging, startX, scrollLeftStart, checkScroll]);

  const handlePointerUp = useCallback(() => {
    const wasDragging = isDragging;
    const draggedEnough = dragDistance > 5;
    const target = clickTarget;
    
    setIsDragging(false);
    const container = containerRef.current;
    if (!container) return;
    
    container.style.cursor = '';
    container.style.userSelect = '';
    
    // Pequeno delay para processar clique se não foi arraste
    setTimeout(() => {
      if (target && wasDragging && !draggedEnough) {
        // Foi um clique, não um arraste
        onSelect(target);
      }
      setClickTarget(null);
    }, 10);
  }, [isDragging, dragDistance, clickTarget, onSelect]);

  // Event listeners globais para drag
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('pointermove', handlePointerMove, { passive: false });
      document.addEventListener('pointerup', handlePointerUp);
      
      return () => {
        document.removeEventListener('pointermove', handlePointerMove);
        document.removeEventListener('pointerup', handlePointerUp);
      };
    }
  }, [isDragging, handlePointerMove, handlePointerUp]);

  return (
    <div className="relative">
      {/* Container com fade effects */}
      <div className="relative overflow-hidden">
        {/* Fade esquerdo */}
        <div 
          className={`absolute left-0 top-0 bottom-0 w-6 z-10 pointer-events-none bg-gradient-to-r from-background to-transparent transition-opacity duration-300 ${
            showLeftFade ? 'opacity-100' : 'opacity-0'
          }`}
        />
        
        {/* Fade direito */}
        <div 
          className={`absolute right-0 top-0 bottom-0 w-6 z-10 pointer-events-none bg-gradient-to-l from-background to-transparent transition-opacity duration-300 ${
            showRightFade ? 'opacity-100' : 'opacity-0'
          }`}
        />

        {/* Container principal com scroll funcional */}
        <div
          ref={containerRef}
          className="flex gap-2 overflow-x-auto py-1 transition-colors flex-nowrap select-none touch-pan-x overscroll-x-contain"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            cursor: isDragging ? 'grabbing' : 'grab',
            WebkitOverflowScrolling: 'touch',
            overscrollBehaviorX: 'contain',
          }}
          onPointerDown={(e) => handlePointerDown(e)}
          data-category-scroll
        >
          {/* Estilos inline para garantir ocultação */}
          <style jsx>{`
            [data-category-scroll]::-webkit-scrollbar {
              display: none !important;
              width: 0 !important;
              height: 0 !important;
              background: transparent !important;
            }
          `}</style>

          {categories.map((c) => {
            const isActive = activeCategory === c.name;
            
            return (
              <button
                key={c.name}
                type="button"
                onPointerDown={(e) => handlePointerDown(e, c.name)}
                className={`
                  whitespace-nowrap rounded-lg px-3 py-1.5 text-[9px] font-black uppercase tracking-widest 
                  transition-all flex items-center gap-2 border flex-shrink-0
                  touch-manipulation select-none
                  ${isActive
                    ? "bg-primary border-primary text-primary-foreground shadow-md shadow-primary/20"
                    : "bg-card text-muted-foreground border-border hover:border-primary/30 hover:text-primary"
                  }
                  ${isDragging ? 'transition-none' : ''}
                `}
                draggable="false"
              >
                <span>{c.name}</span>
                
                <span className={`px-1 py-0.5 rounded text-[8px] font-black transition-colors ${
                  isActive 
                    ? "bg-primary-foreground/20 text-primary-foreground" 
                    : "bg-muted text-muted-foreground"
                }`}>
                  {c.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}