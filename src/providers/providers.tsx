"use client";

import { Toaster } from "sonner";
import QueryProvider from "./query-provider";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryProvider>
      <Toaster position="bottom-right" />
      {children}
    </QueryProvider>
  );
}
