"use client";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import * as React from "react";

export default function SearchBar({
  onSearch,
}: {
  onSearch?: (q: string) => void;
}) {
  const [q, setQ] = React.useState("");
  function submit() {
    onSearch?.(q.trim());
  }
  return (
    <div className="flex w-full max-w-3xl items-center gap-2">
      <Input
        placeholder="Nome do profissional ou categoria (ex.: Marketing)"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && submit()}
      />
      <Button onClick={submit}>Buscar</Button>
    </div>
  );
}
