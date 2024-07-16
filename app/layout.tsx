// app/layout.tsx
import "./globals.css";
import type { Metadata } from "next";
import { Providers } from "./providers";
import LocalFontLoader from "next/font/local";
import Navbar from "./_assets/components/Navbar";
import Footer from "./_assets/components/Footer";
import AnimatedContentWrapper from "./_assets/components/AnimatedContentWrapper";

const Kurale = LocalFontLoader({ variable: "--font-Kurale", src: "./_assets/fonts/Kurale.ttf" });
const Brittany = LocalFontLoader({ variable: "--font-Brittany", src: "./_assets/fonts/Brittany.otf" });

export const metadata: Metadata = { description: "Online Food Delivery and Order", title: "Sizzle & Spice" };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`h-full ${Kurale.variable} ${Brittany.variable}`}>
      <body className="flex h-screen bg-primary font-Kurale">
        <Providers>
          <AnimatedContentWrapper>
            <Navbar />
            {children}
            <Footer />
          </AnimatedContentWrapper>
        </Providers>
      </body>
    </html>
  );
}
