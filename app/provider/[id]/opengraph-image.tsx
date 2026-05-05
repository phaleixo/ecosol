import { ImageResponse } from "next/og";
import prisma from "@/lib/prisma";

export const runtime = "nodejs";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

function truncateText(value: string, maxLength: number): string {
  if (value.length <= maxLength) return value;
  return `${value.slice(0, maxLength - 3).trimEnd()}...`;
}

function buildOptimizedImageUrl(rawUrl: string): string | null {
  try {
    const parsed = new URL(rawUrl);

    if (parsed.protocol !== "https:" && parsed.protocol !== "http:") {
      return null;
    }

    // Mantemos a otimização, mas forçando formato de origem para evitar webp/avif em OG.
    parsed.searchParams.set("width", "320");
    parsed.searchParams.set("height", "320");
    parsed.searchParams.set("resize", "cover");
    parsed.searchParams.set("format", "origin");

    return parsed.toString();
  } catch {
    return null;
  }
}

async function fetchImageAsBase64(url: string): Promise<string | null> {
  try {
    const response = await fetch(url, {
      signal: AbortSignal.timeout(6000),
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; EcosolOGBot/1.0)",
        "Accept": "image/png,image/jpeg,image/jpg,image/*;q=0.8",
        "Referer": "https://ecosolautista.com.br/",
      },
    });
    
    if (!response.ok) return null;
    
    const contentType = response.headers.get("content-type")?.toLowerCase() ?? "";
    if (!contentType.startsWith("image/")) return null;
    if (contentType.includes("webp") || contentType.includes("avif")) return null;

    const contentLength = Number.parseInt(response.headers.get("content-length") ?? "0", 10);
    if (contentLength > MAX_IMAGE_BYTES) return null;
    
    const buffer = await response.arrayBuffer();
    if (buffer.byteLength > MAX_IMAGE_BYTES) return null;

    const base64 = Buffer.from(buffer).toString("base64");
    
    return `data:${contentType};base64,${base64}`;
  } catch (error) {
    console.error("Fetch error:", error);
    return null;
  }
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
    const description = truncateText(descriptionRaw, 120);
    
    let imageDataUrl: string | null = null;
    if (service.image) {
      const optimizedImageUrl = buildOptimizedImageUrl(service.image);
      if (optimizedImageUrl) {
        imageDataUrl = await fetchImageAsBase64(optimizedImageUrl);
      }
    }

    return new ImageResponse(
      <div style={{
        width: "100%",
        height: "100%",
        display: "flex",
        background: "#0f172a",
        color: "#f8fafc",
        padding: 40,
        gap: 32,
      }}>
        {/* Imagem */}
        <div style={{
          width: 320,
          height: 320,
          borderRadius: 20,
          overflow: "hidden",
          background: "#111827",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          alignSelf: "center",
        }}>
          {imageDataUrl ? (
            <img src={imageDataUrl} alt={headline} style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }} />
          ) : (
            <div style={{ fontSize: 120, opacity: 0.8 }}>🏢</div>
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
            border: "1px solid rgba(34,197,94,0.5)",
            background: "rgba(34,197,94,0.15)",
            color: "#86efac",
            padding: "8px 16px",
            fontSize: 22,
            fontWeight: 700,
            textTransform: "uppercase",
            whiteSpace: "nowrap",
            textOverflow: "ellipsis",
          }}>
            {categoryPill}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{
              fontSize: 58,
              fontWeight: 800,
              lineHeight: 1,
              letterSpacing: "-0.02em",
            }}>
              {headline}
            </div>

            

            <div style={{
              fontSize: 28,
              lineHeight: 1.35,
              color: "rgba(248,250,252,0.9)",
              overflow: "hidden",
              maxHeight: 228,
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
        background: "#1a1a1a",
        color: "white",
        fontSize: 48,
      }}>
        ECOSOL Autista
      </div>,
      { ...size }
    );
  }
}