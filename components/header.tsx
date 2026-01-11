"use client";
import Link from "next/link";
import Image from "next/image";
import { Button } from "./ui/button";

export default function Header() {
  return (
    <header className="w-full border-b bg-slate-100 backdrop-blur sticky top-0 z-40 border-slate-200">
      <div className="mx-auto max-w-6xl flex items-center justify-between p-4">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/logo.png"
            alt="Logo"
            width={32}
            height={32}
            className="h-8 w-8 rounded-full object-cover"
            priority
          />
          <div className="flex flex-col leading-tight">
            <span className="font-extrabold text-2xl tracking-tight">
              ECOSOL
            </span>
            <span className="text-xs text-slate-600">Entre Autistas</span>
          </div>
        </Link>
        <Link href="/submit">
          <Button>Cadastre seu negócio</Button>
        </Link>
      </div>
    </header>
  );
}
