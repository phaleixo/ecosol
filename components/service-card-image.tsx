"use client";

import Image from "next/image";
import Link from "next/link";

type Service = {
  id: string;
  name: string;
  image?: string | null;
};

export default function ServiceCardImage({
  service,
  eager,
}: {
  service: Service;
  eager?: boolean;
}) {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <Link
        href={`/provider/${service.id}`}
        aria-label={`Ver perfil de ${service.name}`}
        className="w-full h-full block"
      >
        <div className="relative aspect-video rounded-[1.6rem] bg-muted overflow-hidden border border-border w-full h-full">
          <Image
            src={service.image || "/ecosol-meta.png"}
            alt={service.name}
            fill
            sizes="(max-width: 640px) 100vw, 50vw"
            loading={eager ? "eager" : undefined}
            className="object-cover"
          />
        </div>
      </Link>
    </div>
  );
}
