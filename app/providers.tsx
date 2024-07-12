// app/providers.tsx
"use client";
import * as Ably from "ably";
import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { SessionProvider } from "next-auth/react";
import { AblyProvider, ChannelProvider } from "ably/react";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());
  const AblyClient = new Ably.Realtime({ authUrl: `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/token`, authMethod: "POST" });

  return (
    <AblyProvider client={AblyClient}>
      <SessionProvider>
        <QueryClientProvider client={queryClient}>
          <ChannelProvider channelName="orders">
            <AnimatePresence mode="wait">{children}</AnimatePresence>
            <ReactQueryDevtools initialIsOpen={false} />
          </ChannelProvider>
        </QueryClientProvider>
      </SessionProvider>
    </AblyProvider>
  );
}
