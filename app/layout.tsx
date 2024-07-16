// app/layout.tsx
import "./globals.css";
import type { Metadata } from "next";
import { Providers } from "./providers";
import LocalFontLoader from "next/font/local";
import Navbar from "./_src/components/Navbar";
import Footer from "./_src/components/Footer";
import AnimatedContentWrapper from "./_src/components/AnimatedContentWrapper";

const Kurale = LocalFontLoader({ variable: "--font-Kurale", src: "./_src/fonts/Kurale.ttf" });
const Playfair = LocalFontLoader({ variable: "--font-Playfair", src: "./_src/fonts/Playfair.ttf" });
const Grenoble = LocalFontLoader({ variable: "--font-Grenoble", src: "./_src/fonts/Grenoble.ttf" });
const Brittany = LocalFontLoader({ variable: "--font-Brittany", src: "./_src/fonts/Brittany.otf" });
const Merriweather = LocalFontLoader({ variable: "--font-Merriweather", src: "./_src/fonts/Merriweather.ttf" });
const RobotoCondensed = LocalFontLoader({ variable: "--font-RobotoCondensed", src: "./_src/fonts/RobotoCondensed.ttf" });

export const metadata: Metadata = { description: "Online Food Delivery and Order", title: "Sizzle & Spice" };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`h-full ${Kurale.variable} ${Playfair.variable} ${Grenoble.variable} ${Brittany.variable} ${Merriweather.variable} ${RobotoCondensed.variable}`}>
      <body className="flex h-screen bg-primary">
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
