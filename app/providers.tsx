// app/providers.tsx
"use client";
import { useState } from "react";
import { ThemeProvider } from "next-themes";
import { AnimatePresence } from "framer-motion";
import { SessionProvider } from "next-auth/react";
import { CartProvider } from "./utils/context/CartContext";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export function Providers({ children }: { children: React.ReactNode }) {
    const [queryClient] = useState(() => new QueryClient());

    return (
        <ThemeProvider attribute="class">
            <CartProvider>
                <SessionProvider>
                    <QueryClientProvider client={queryClient}>
                        <AnimatePresence mode="wait">{children}</AnimatePresence>
                        <ReactQueryDevtools initialIsOpen={false} />
                    </QueryClientProvider>
                </SessionProvider>
            </CartProvider>
        </ThemeProvider>
    );
}
