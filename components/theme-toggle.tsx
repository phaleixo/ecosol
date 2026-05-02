"use client";

import * as React from "react";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <div className="md:hidden mt-4 flex items-center justify-center w-full">
      <div className="flex items-center justify-center bg-muted/50 p-1 rounded-xl">
        <button
          onClick={() => setTheme("light")}
          className={`flex items-center justify-center px-3 py-1.5 rounded-lg transition-all ${
            theme === "light"
              ? "bg-background text-primary shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Sun size={14} />
        </button>
        <button
          onClick={() => setTheme("dark")}
          className={`flex items-center justify-center px-3 py-1.5 rounded-lg transition-all ml-2 ${
            theme === "dark"
              ? "bg-background text-primary shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Moon size={14} />
        </button>
      </div>
    </div>
  );
}
