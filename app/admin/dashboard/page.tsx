"use client";
import * as React from "react";
import Header from "../../../components/header";
import { Button } from "../../../components/ui/button";
import ServiceCard from "../../../components/service-card";

export default function AdminDashboard() {
  const [pending, setPending] = React.useState<any[]>([]);

  async function load() {
    const res = await fetch("/api/admin/pending");
    const data = await res.json();
    setPending(data);
  }

  React.useEffect(() => {
    if (sessionStorage.getItem("admin:auth")) load();
    else window.location.href = "/admin/login";
  }, []);

  async function approve(id: number) {
    await fetch("/api/admin/approve", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    load();
  }

  async function action(id: number, type: "suspend" | "remove") {
    await fetch("/api/admin/action", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, type }),
    });
    load();
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Header />
      <main className="mx-auto max-w-6xl p-6">
        <h2 className="text-2xl font-semibold">Admin Dashboard</h2>
        <p className="text-slate-600">Pending submissions</p>
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {pending.length === 0 && (
            <div className="col-span-full text-center text-slate-500">
              No pending submissions
            </div>
          )}
          {pending.map((p) => (
            <div key={p.id} className="space-y-2">
              <ServiceCard service={p} />
              <div className="flex gap-2">
                <Button onClick={() => approve(p.id)}>Approve</Button>
                <Button onClick={() => action(p.id, "suspend")}>Suspend</Button>
                <Button onClick={() => action(p.id, "remove")}>Remove</Button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
