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

  function submit(e: React.FormEvent) {
    e.preventDefault();
    // simple demo auth — in production replace with real auth
    if (user === "admin" && pass === "password") {
      sessionStorage.setItem("admin:auth", "1");
      router.push("/admin/dashboard");
    } else {
      alert("Invalid credentials: use admin / password");
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
