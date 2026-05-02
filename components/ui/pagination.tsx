// components/ui/pagination.tsx
"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight, ChevronFirst, ChevronLast, MoreHorizontal } from "lucide-react";
import { Button } from "./button";
import { cn } from "@/lib/utils";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  isSearching?: boolean;
  className?: string;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  isSearching = false,
  className,
}: PaginationProps) {
  // Se não há páginas, não renderizar
  if (totalPages <= 1) return null;

  // Funções de navegação
  const goToPage = (page: number) => {
    if (page < 1 || page > totalPages || isSearching) return;
    onPageChange(page);
  };

  const goToFirstPage = () => goToPage(1);
  const goToLastPage = () => goToPage(totalPages);
  const goToPrevPage = () => goToPage(currentPage - 1);
  const goToNextPage = () => goToPage(currentPage + 1);

  // Gerar array de páginas para exibição mobile (apenas algumas)
  const getMobilePageNumbers = () => {
    if (totalPages <= 3) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    
    if (currentPage === 1) {
      return [1, 2, 3];
    }
    
    if (currentPage === totalPages) {
      return [totalPages - 2, totalPages - 1, totalPages];
    }
    
    return [currentPage - 1, currentPage, currentPage + 1];
  };

  // Gerar array de páginas para desktop
  const getDesktopPageNumbers = () => {
    const maxVisible = 5;
    
    if (totalPages <= maxVisible) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const half = Math.floor(maxVisible / 2);
    let start = Math.max(1, currentPage - half);
    let end = Math.min(totalPages, currentPage + half);

    if (currentPage <= half + 1) {
      start = 1;
      end = maxVisible;
    } else if (currentPage >= totalPages - half) {
      start = totalPages - maxVisible + 1;
      end = totalPages;
    }

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  const mobilePageNumbers = getMobilePageNumbers();
  const desktopPageNumbers = getDesktopPageNumbers();

  return (
    <div className={cn("w-full", className)}>
      {/* Controles Mobile */}
      <div className="sm:hidden">
        <div className="px-2 py-2">
          <div className="bg-card border border-border rounded-lg p-2 shadow-sm">
            <div className="flex items-center justify-between gap-1">
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={goToFirstPage}
                  disabled={currentPage === 1 || isSearching}
                  className="h-8 w-8 rounded-lg p-0 hover:bg-primary/10"
                  title="Primeira"
                >
                  <ChevronFirst className="h-3.5 w-3.5" />
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={goToPrevPage}
                  disabled={currentPage === 1 || isSearching}
                  className="h-8 w-8 rounded-lg p-0 hover:bg-primary/10"
                  title="Anterior"
                >
                  <ChevronLeft className="h-3.5 w-3.5" />
                </Button>
              </div>

              <div className="flex items-center gap-1 flex-1 justify-center">
                {mobilePageNumbers.map((page) => (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "ghost"}
                    size="sm"
                    onClick={() => goToPage(page)}
                    disabled={isSearching}
                    className={cn(
                      "h-8 w-8 rounded-lg p-0 min-w-8 font-medium",
                      currentPage === page && "shadow-sm"
                    )}
                  >
                    {page}
                  </Button>
                ))}
                
                {totalPages > 3 && currentPage < totalPages - 1 && (
                  <span className="text-muted-foreground px-1">...</span>
                )}
                
                {totalPages > 3 && !mobilePageNumbers.includes(totalPages) && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => goToPage(totalPages)}
                    disabled={isSearching}
                    className="h-8 w-8 rounded-lg p-0 min-w-8 font-medium"
                  >
                    {totalPages}
                  </Button>
                )}
              </div>

              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={goToNextPage}
                  disabled={currentPage === totalPages || isSearching}
                  className="h-8 w-8 rounded-lg p-0 hover:bg-primary/10"
                  title="Próxima"
                >
                  <ChevronRight className="h-3.5 w-3.5" />
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={goToLastPage}
                  disabled={currentPage === totalPages || isSearching}
                  className="h-8 w-8 rounded-lg p-0 hover:bg-primary/10"
                  title="Última"
                >
                  <ChevronLast className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>

            <div className="w-full bg-muted/30 h-1.5 rounded-full overflow-hidden mt-2">
              <div 
                className="h-full bg-primary transition-all duration-300"
                style={{ width: `${(currentPage / totalPages) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Controles Desktop - AGORA CENTRALIZADO */}
      <div className="hidden sm:block">
        <div className="flex flex-col items-center gap-4">
          <div className="flex items-center justify-center gap-1">
            <Button
              variant="outline"
              size="sm"
              onClick={goToFirstPage}
              disabled={currentPage === 1 || isSearching}
              className="h-9 w-9 rounded-lg"
              title="Primeira página"
            >
              <ChevronFirst className="h-3.5 w-3.5" />
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={goToPrevPage}
              disabled={currentPage === 1 || isSearching}
              className="h-9 w-9 rounded-lg"
              title="Página anterior"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
            </Button>
            
            <div className="flex items-center gap-1 mx-2">
              {desktopPageNumbers.map((page, index) => (
                <React.Fragment key={page}>
                  {index > 0 && desktopPageNumbers[index - 1] !== page - 1 && (
                    <span className="h-9 w-9 flex items-center justify-center text-muted-foreground">
                      <MoreHorizontal className="h-4 w-4" />
                    </span>
                  )}
                  
                  <Button
                    variant={currentPage === page ? "default" : "outline"}
                    size="sm"
                    onClick={() => goToPage(page)}
                    disabled={isSearching}
                    className={cn(
                      "h-9 w-9 rounded-lg font-medium transition-all",
                      currentPage === page && "shadow-sm"
                    )}
                  >
                    {page}
                  </Button>
                </React.Fragment>
              ))}
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={goToNextPage}
              disabled={currentPage === totalPages || isSearching}
              className="h-9 w-9 rounded-lg"
              title="Próxima página"
            >
              <ChevronRight className="h-3.5 w-3.5" />
            </Button>
            
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={goToLastPage}
              disabled={currentPage === totalPages || isSearching}
              className="h-9 w-9 rounded-lg"
              title="Última página"
            >
              <ChevronLast className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}