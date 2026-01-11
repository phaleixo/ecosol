"use client";
import * as React from "react";

const CATEGORIES = [
  "All Services",
  "Construction",
  "Beauty",
  "Tech",
  "Legal",
  "Marketing",
  "Wellness",
];

export default function CategoryFilter({
  onChange,
}: {
  onChange?: (cat: string) => void;
}) {
  const [active, setActive] = React.useState("All Services");
  return (
    <div className="flex gap-2 overflow-x-auto py-1">
      {CATEGORIES.map((c) => (
        <button
          key={c}
          onClick={() => {
            setActive(c);
            onChange?.(c);
          }}
          className={
            "whitespace-nowrap rounded-full px-4 py-1 text-sm " +
            (active === c
              ? "bg-blue-600 text-white"
              : "bg-slate-100 text-slate-700")
          }
        >
          {c}
        </button>
      ))}
    </div>
  );
}
