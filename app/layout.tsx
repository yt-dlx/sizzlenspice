// app/layout.tsx
import "./globals.css";
import type { Metadata } from "next";
import LocalFontLoader from "next/font/local";
import { Providers } from "./providers";
import Navbar from "@/app/_components/Navbar";
import Footer from "@/app/_components/Footer";
import AnimatedContentWrapper from "@/app/_components/AnimatedContentWrapper";

const Kurale = LocalFontLoader({ variable: "--font-Kurale", src: "./_fonts/Kurale.ttf" });
const Playfair = LocalFontLoader({ variable: "--font-Playfair", src: "./_fonts/Playfair.ttf" });
const Grenoble = LocalFontLoader({ variable: "--font-Grenoble", src: "./_fonts/Grenoble.ttf" });
const Brittany = LocalFontLoader({ variable: "--font-Brittany", src: "./_fonts/Brittany.otf" });
const Merriweather = LocalFontLoader({
  variable: "--font-Merriweather",
  src: "./_fonts/Merriweather.ttf",
});
const RobotoCondensed = LocalFontLoader({
  variable: "--font-RobotoCondensed",
  src: "./_fonts/RobotoCondensed.ttf",
});

export const metadata: Metadata = {
  description: "Online Food Delivery and Order",
  title: "Sizzle & Spice",
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`h-full ${Kurale.variable} ${Playfair.variable} ${Grenoble.variable} ${Brittany.variable} ${Merriweather.variable} ${RobotoCondensed.variable}`}>
      <body className="flex h-screen">
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
