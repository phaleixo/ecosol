"use client";
import * as React from "react";

export function Button({
  children,
  className = "",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={
        "inline-flex items-center justify-center rounded-md bg-blue-600 text-white px-4 py-2 text-sm hover:bg-blue-700 disabled:opacity-50 " +
        className
      }
    >
      {children}
    </button>
  );
}
