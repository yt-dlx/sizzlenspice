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

export const metadata: Metadata = {
  title: "Sizzle 'n Spice - Delicious Indian Cuisine Delivered",
  description: "Order delicious Indian foods like Palak Paneer, Butter Chicken, and more from Sizzle 'n Spice and get them delivered to your doorstep.",
  keywords: "Indian cuisine, Palak Paneer, Butter Chicken, Paneer Tikka, Biryani, food delivery",
};

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
