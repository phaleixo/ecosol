// Theme provider removed: keep a simple wrapper returning children

"use client";

import * as React from "react";

export function ThemeProvider({ children }: React.PropsWithChildren<unknown>) {
  return <>{children}</>;
}
