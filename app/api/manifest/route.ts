import { NextResponse } from "next/server";
import pkg from "../../../package.json";

export async function GET() {
  const version = pkg?.version ? `v${pkg.version}` : "v0.0.0";

  const manifest = {
    id: "/",
    name: "ECOSOL",
    short_name: "ECOSOL",
    version,
    description:
      "Plataforma colaborativa que conecta profissionais autistas, promovendo autonomia financeira.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#0ea5a3",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any maskable" }
    ],
  };

  return NextResponse.json(manifest, {
    headers: { "Content-Type": "application/manifest+json" },
  });
}
