"use client";
import * as React from "react";

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
  return (
    /* py-1 para achatar a barra ao máximo */
    <div className="flex gap-2 overflow-x-auto no-scrollbar py-1">
      {categories.map((c) => {
        const isActive = activeCategory === c.name;
        
        return (
          <button
            key={c.name}
            onClick={() => onSelect(c.name)}
            className={`
              whitespace-nowrap rounded-lg px-3 py-1.5 text-[9px] font-black uppercase tracking-widest transition-all flex items-center gap-2 border
              ${isActive
                ? "bg-blue-600 border-blue-600 text-white shadow-sm"
                : "bg-white text-slate-400 border-slate-100 hover:border-blue-100 hover:text-blue-600"
              }
            `}
          >
            <span>{c.name}</span>
            <span className={`px-1 py-0.5 rounded text-[8px] font-black ${
              isActive ? "bg-blue-500 text-white" : "bg-slate-50 text-slate-400"
            }`}>
              {c.count}
            </span>
          </button>
        );
      })}
    </div>
  );
}