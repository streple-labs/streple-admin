"use client";

import { Toaster } from "sonner";
import QueryProvider from "./query-provider";
import { AuthProvider } from "../context/auth-context";
import { Next13ProgressBar } from "next13-progressbar";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Next13ProgressBar
        height="4px"
        color="#B39FF0"
        options={{ showSpinner: false }}
        showOnShallow={true}
      />
      <QueryProvider>
        <AuthProvider>
          <Toaster position="bottom-right" />
          {children}
        </AuthProvider>
      </QueryProvider>
    </>
  );
}
