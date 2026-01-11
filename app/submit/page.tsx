"use client";
import * as React from "react";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import Header from "../../components/header";

export default function SubmitPage() {
  const [form, setForm] = React.useState({
    name: "",
    category: "",
    image: "",
    whatsapp: "",
    instagram: "",
    tiktok: "",
    email: "",
    site: "",
  });
  const [status, setStatus] = React.useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    const res = await fetch("/api/submissions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) setStatus("submitted");
    else setStatus("error");
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Header />
      <main className="mx-auto max-w-3xl p-6">
        <h2 className="text-2xl font-semibold">Register your business</h2>
        <p className="text-slate-600">
          Fill the form to submit your listing. Submissions are reviewed by an
          administrator.
        </p>

        <form onSubmit={submit} className="mt-6 grid gap-3">
          <Input
            placeholder="Business name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <Input
            placeholder="Category"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
          />
          <Input
            placeholder="Image URL (optional)"
            value={form.image}
            onChange={(e) => setForm({ ...form, image: e.target.value })}
          />
          <Input
            placeholder="Whatsapp URL"
            value={form.whatsapp}
            onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
          />
          <Input
            placeholder="Instagram URL"
            value={form.instagram}
            onChange={(e) => setForm({ ...form, instagram: e.target.value })}
          />
          <Input
            placeholder="Tiktok URL"
            value={form.tiktok}
            onChange={(e) => setForm({ ...form, tiktok: e.target.value })}
          />
          <Input
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <Input
            placeholder="Website"
            value={form.site}
            onChange={(e) => setForm({ ...form, site: e.target.value })}
          />

          <div className="flex items-center gap-2">
            <Button type="submit">Submit</Button>
            {status === "loading" && <span>Sending...</span>}
            {status === "submitted" && (
              <span className="text-green-600">Submitted! Await approval.</span>
            )}
            {status === "error" && (
              <span className="text-red-600">Error, try again.</span>
            )}
          </div>
        </form>
      </main>
    </div>
  );
}
