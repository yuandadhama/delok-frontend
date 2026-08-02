"use client";

import { ReactNode } from "react";
import { QueryProvider } from "./QueryProvider";
import { ThemeProvider } from "./ThemeProvider";
import { SocketProvider } from "./SocketProvider";

export function AppProvider({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <QueryProvider>
        <SocketProvider>{children}</SocketProvider>
      </QueryProvider>
    </ThemeProvider>
  );
}
