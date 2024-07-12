// app/providers.tsx
"use client";
import * as Ably from "ably";
import { useState } from "react";
import { AblyProvider } from "ably/react";
import { AnimatePresence } from "framer-motion";
import { SessionProvider } from "next-auth/react";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());
  const AblyClient = new Ably.Realtime({ authUrl: "/api/token" });

  return (
    <AblyProvider client={AblyClient}>
      <SessionProvider>
        <QueryClientProvider client={queryClient}>
          <AnimatePresence mode="wait">{children}</AnimatePresence>
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </SessionProvider>
    </AblyProvider>
  );
}
