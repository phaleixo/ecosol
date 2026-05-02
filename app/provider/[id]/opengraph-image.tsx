import { ImageResponse } from "next/og";
import prisma from "@/lib/prisma";

export const runtime = "nodejs";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const providerId = Number.parseInt(id, 10);

  const service = Number.isNaN(providerId)
    ? null
    : await prisma.service.findUnique({
        where: { id: providerId },
        select: {
          name: true,
          description: true,
          category: true,
          image: true,
          approved: true,
        },
      });

  const title = service?.name || "ECOSOL Autista";
  const category = service?.category || "Prestador";
  const descriptionRaw =
    service?.description?.trim() ||
    "Conheça este perfil na rede ECOSOL Autista.";
  const description =
    descriptionRaw.length > 180
      ? `${descriptionRaw.slice(0, 177)}...`
      : descriptionRaw;

  const imageUrl = service?.approved && service.image ? service.image : null;

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        background:
          "linear-gradient(140deg, #0f172a 0%, #1e293b 60%, #334155 100%)",
        color: "#f8fafc",
        fontFamily: "Arial, sans-serif",
        padding: 36,
        gap: 30,
      }}
    >
      <div
        style={{
          width: 460,
          height: "100%",
          borderRadius: 18,
          overflow: "hidden",
          border: "2px solid rgba(255,255,255,0.18)",
          background: "#111827",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imageUrl}
            alt={title}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
            }}
          />
        ) : (
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 120,
              opacity: 0.8,
            }}
          >
            🏢
          </div>
        )}
      </div>

      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          minWidth: 0,
        }}
      >
        <div
          style={{
            display: "inline-flex",
            alignSelf: "flex-start",
            borderRadius: 999,
            border: "1px solid rgba(34,197,94,0.5)",
            background: "rgba(34,197,94,0.15)",
            color: "#86efac",
            padding: "8px 16px",
            fontSize: 22,
            fontWeight: 700,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            maxWidth: 620,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {category}
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 16,
          }}
        >
          <div
            style={{
              fontSize: 58,
              fontWeight: 800,
              lineHeight: 1,
              letterSpacing: "-0.02em",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              maxWidth: 640,
            }}
          >
            {title}
          </div>

          <div
            style={{
              fontSize: 28,
              lineHeight: 1.35,
              color: "rgba(248,250,252,0.9)",
              display: "-webkit-box",
              WebkitLineClamp: 4,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              maxWidth: 640,
            }}
          >
            {description}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            color: "rgba(248,250,252,0.85)",
            fontSize: 22,
            fontWeight: 600,
          }}
        >
          <span>ECOSOL Autista</span>
          <span style={{ opacity: 0.5 }}>•</span>
          <span>economia solidária</span>
        </div>
      </div>
    </div>,
    {
      ...size,
    },
  );
}
