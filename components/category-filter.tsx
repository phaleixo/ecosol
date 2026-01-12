"use client";
import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";

// Definimos a estrutura exata que o componente espera
interface CategoryData {
  name: string;
  count: number;
}

interface CategoryFilterProps {
  categories: CategoryData[];
}

export default function CategoryFilter({ categories }: CategoryFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const active = searchParams.get("category") || "Todas";

  function handleFilter(categoryName: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (categoryName === "Todas") {
      params.delete("category");
    } else {
      params.set("category", categoryName);
    }
    params.delete("page");
    router.push(`/?${params.toString()}`, { scroll: false });
  }

  return (
    <div className="flex gap-2 overflow-x-auto py-2 no-scrollbar border-b mb-6">
      {categories.map((c) => (
        <button
          key={c.name}
          onClick={() => handleFilter(c.name)}
          className={
            "whitespace-nowrap rounded-full px-4 py-1.5 text-sm font-medium transition-all flex items-center gap-2 " +
            (active === c.name
              ? "bg-blue-600 text-white shadow-md scale-105"
              : "bg-white text-slate-700 border hover:bg-slate-100")
          }
        >
          <span>{c.name}</span>
          <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
            active === c.name ? "bg-blue-500 text-white" : "bg-slate-100 text-slate-500"
          }`}>
            {c.count}
          </span>
        </button>
      ))}
    </div>
  );
}