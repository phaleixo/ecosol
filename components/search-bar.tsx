"use client";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [q, setQ] = React.useState(searchParams.get("q") || "");

  function handleSearch() {
    const params = new URLSearchParams(searchParams);
    if (q) params.set("q", q);
    else params.delete("q");
    
    // Atualiza a URL de forma suave (SPA navigation)
    router.push(`/?${params.toString()}`);
    router.refresh();
  }

  return (
    <div className="flex w-full max-w-3xl items-center gap-2">
      <Input
        placeholder="O que você procura hoje?"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
      />
      <Button onClick={handleSearch}>Buscar</Button>
    </div>
  );
}