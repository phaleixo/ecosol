"use client";
import { Card } from "./ui/card";
import ContactIcons from "./contact-icons";
import Link from "next/link";

export default function ServiceCard({ service }: { service: any }) {
  return (
    <Card className="max-w-sm">
      <div className="flex flex-col gap-3">
        <div className="h-40 w-full rounded-md bg-slate-200 flex items-center justify-center overflow-hidden">
          {service.image ? (
            <img
              src={service.image}
              alt={service.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="text-3xl">🏢</div>
          )}
        </div>
        <div>
          <h3 className="font-semibold">{service.name}</h3>
          <p className="text-sm text-slate-500">{service.category}</p>
        </div>
        <div className="flex items-center justify-between">
          <ContactIcons contacts={service} />
          <Link href={`/provider/${service.id}`} className="text-blue-600">
            View Profile
          </Link>
        </div>
      </div>
    </Card>
  );
}
