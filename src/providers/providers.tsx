"use client";

import { Toaster } from "sonner";
import QueryProvider from "./query-provider";
import { AuthProvider } from "../context/auth-context";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryProvider>
      <AuthProvider>
        <Toaster position="bottom-right" />
        {children}
      </AuthProvider>
    </QueryProvider>
  );
}
