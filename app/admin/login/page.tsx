"use client";
import * as React from "react";
import Header from "../../../components/header";
import { Input } from "../../../components/ui/input";
import { Button } from "../../../components/ui/button";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const [user, setUser] = React.useState("");
  const [pass, setPass] = React.useState("");
  const router = useRouter();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    // Em produção, use uma rota de API para verificar e setar o cookie
    if (user === "admin" && pass === "password") {
      // Exemplo simplificado: o ideal é chamar uma API que define o cookie HttpOnly
      document.cookie = `admin_token=${pass}; path=/; samesite=strict`;
      router.push("/admin/dashboard");
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Header />
      <main className="mx-auto max-w-md p-6">
        <h2 className="text-2xl font-semibold">Admin login</h2>
        <form onSubmit={submit} className="mt-4 grid gap-3">
          <Input
            placeholder="Username"
            value={user}
            onChange={(e) => setUser(e.target.value)}
          />
          <Input
            placeholder="Password"
            type="password"
            value={pass}
            onChange={(e) => setPass(e.target.value)}
          />
          <Button type="submit">Sign in</Button>
        </form>
      </main>
    </div>
  );
}
