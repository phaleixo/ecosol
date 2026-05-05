import { ImageResponse } from "next/og";
import prisma from "@/lib/prisma";

export const runtime = "nodejs";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

const MAX_IMAGE_BYTES = 300 * 1024; // 300 KB — limite para WhatsApp

function truncateText(value: string, maxLength: number): string {
  if (value.length <= maxLength) return value;
  return `${value.slice(0, maxLength - 3).trimEnd()}...`;
}

function sanitizeUrl(rawUrl: string): string | null {
  try {
    const parsed = new URL(rawUrl);
    if (parsed.protocol !== "https:" && parsed.protocol !== "http:") return null;
    return parsed.toString();
  } catch {
    return null;
  }
}

async function fetchOptimizedImageBase64(rawUrl: string): Promise<string | null> {
  // Usa um proxy de otimização (weserv) e tenta reduções progressivas até caber em 300KB
  const proxyBase = "https://images.weserv.nl/?";
  const qualities = [80, 60, 40, 30, 20];
  const widths = [550, 480, 400, 320, 240];

  const sanitized = sanitizeUrl(rawUrl);
  if (!sanitized) return null;

  for (const w of widths) {
    for (const q of qualities) {
      const proxyUrl = `${proxyBase}url=${encodeURIComponent(sanitized)}&w=${w}&fit=contain&output=jpg&q=${q}`;
      try {
        const response = await fetch(proxyUrl, {
          signal: AbortSignal.timeout(6000),
          headers: {
            "User-Agent": "Mozilla/5.0 (compatible; EcosolOGBot/1.0)",
            "Accept": "image/jpeg,image/*;q=0.8",
            "Referer": "https://ecosolautista.com.br/",
          },
        });

        if (!response.ok) continue;

        const contentType = (response.headers.get("content-type") || "").toLowerCase();
        if (!contentType.startsWith("image/")) continue;

        const buffer = await response.arrayBuffer();
        if (buffer.byteLength > MAX_IMAGE_BYTES) continue;

        const base64 = Buffer.from(buffer).toString("base64");
        return `data:${contentType};base64,${base64}`;
      } catch (err) {
        console.error("Optimized fetch error:", err);
        continue;
      }
    }
  }

  return null;
}

export default async function Image({ params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const providerId = Number.parseInt(id, 10);

    const service = await prisma.service.findUnique({
      where: { id: providerId },
      select: {
        name: true,
        description: true,
        category: true,
        image: true,
        approved: true,
      },
    });

    if (!service || !service.approved) {
      throw new Error(`Service not found`);
    }

    const headlineRaw = service.name || "ECOSOL Autista";
    const categoryRaw = service.category || "Prestador";
    const descriptionRaw =
      service.description?.trim() ||
      "Conheça este perfil na ECOSOL Autista e fale com o profissional.";

    const headline = truncateText(headlineRaw, 52);
    const categoryPill = truncateText(categoryRaw, 28);
    const description = truncateText(descriptionRaw, 280);
    
    let imageDataUrl: string | null = null;
    if (service.image) {
      imageDataUrl = await fetchOptimizedImageBase64(service.image);
    }

    return new ImageResponse(
      <div style={{
        width: "100%",
        height: "100%",
        display: "flex",
        background: "#ffffff",
        color: "#374151",
        padding: 40,
        gap: 32,
      }}>
        {/* Imagem */}
        <div style={{
          width: 550,
          height: 630,
          borderRadius: 20,
          background: "#f3f4f6",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          alignSelf: "stretch",
          flexShrink: 0,
          padding: 20,
        }}>
          {imageDataUrl ? (
            <img src={imageDataUrl} alt={headline} style={{
              maxWidth: "100%",
              maxHeight: "100%",
              objectFit: "contain",
            }} />
          ) : (
            <div style={{ fontSize: 140, color: "#9ca3af" }}>🏢</div>
          )}
        </div>

        {/* Conteúdo */}
        <div style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          gap: 24,
        }}>
          <div style={{
            display: "flex",
            alignSelf: "flex-start",
            maxWidth: 520,
            overflow: "hidden",
            borderRadius: 999,
            border: "1px solid #22c55e",
            background: "rgba(34,197,94,0.25)",
            color: "#047857",
            padding: "6px 14px",
            fontSize: 16,
            fontWeight: 700,
            textTransform: "uppercase",
            whiteSpace: "nowrap",
            textOverflow: "ellipsis",
          }}>
            {categoryPill}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{
              fontSize: 42,
              fontWeight: 800,
              lineHeight: 1.1,
              letterSpacing: "-0.02em",
              color: "#111827",
            }}>
              {headline}
            </div>

            

            <div style={{
              fontSize: 18,
              lineHeight: 1.4,
              color: "#374151",
              overflow: "hidden",
              maxHeight: 180,
            }}>
              {description}
            </div>
          </div>

          <div style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            fontSize: 22,
            fontWeight: 600,
            color: "#374151",
          }}>
            
          </div>
        </div>
      </div>,
      { ...size }
    );
  } catch (error) {
    console.error(error);
    return new ImageResponse(
      <div style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#ffffff",
        color: "#111827",
        fontSize: 48,
      }}>
        ECOSOL Autista
      </div>,
      { ...size }
    );
  }
}