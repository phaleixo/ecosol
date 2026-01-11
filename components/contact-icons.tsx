import * as React from "react";

function Icon({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-slate-100 text-slate-700">
      {children}
    </span>
  );
}

export default function ContactIcons({
  contacts,
}: {
  contacts: {
    whatsapp?: string;
    instagram?: string;
    tiktok?: string;
    email?: string;
    site?: string;
  };
}) {
  return (
    <div className="flex items-center gap-2">
      {contacts.whatsapp && (
        <a href={contacts.whatsapp} target="_blank" rel="noreferrer">
          <Icon>W</Icon>
        </a>
      )}
      {contacts.instagram && (
        <a href={contacts.instagram} target="_blank" rel="noreferrer">
          <Icon>I</Icon>
        </a>
      )}
      {contacts.tiktok && (
        <a href={contacts.tiktok} target="_blank" rel="noreferrer">
          <Icon>T</Icon>
        </a>
      )}
      {contacts.email && (
        <a href={`mailto:${contacts.email}`}>
          <Icon>@</Icon>
        </a>
      )}
      {contacts.site && (
        <a href={contacts.site} target="_blank" rel="noreferrer">
          <Icon>🌐</Icon>
        </a>
      )}
    </div>
  );
}
