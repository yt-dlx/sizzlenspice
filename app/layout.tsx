// app/layout.tsx
import "./globals.css";
import type { Metadata } from "next";
import { Providers } from "./providers";
import LocalFontLoader from "next/font/local";
import AnimatedContentWrapper from "@/app/_utils/_components/AnimatedContentWrapper";

const Brittany_Signature = LocalFontLoader({ variable: "--font-Brittany_Signature", src: "./_utils/fonts/Brittany_Signature.otf" });
const Helvetica_Rounded = LocalFontLoader({ variable: "--font-Helvetica_Rounded", src: "./_utils/fonts/Helvetica_Rounded.otf" });
const LobsterTwo_Bold = LocalFontLoader({ variable: "--font-LobsterTwo_Bold", src: "./_utils/fonts/LobsterTwo_Bold.ttf" });
const Hatton_Bold = LocalFontLoader({ variable: "--font-Hatton_Bold", src: "./_utils/fonts/Hatton_Bold.otf" });
const MaronRose = LocalFontLoader({ variable: "--font-MaronRose", src: "./_utils/fonts/MaronRose.ttf" });
const Helvetica = LocalFontLoader({ variable: "--font-Helvetica", src: "./_utils/fonts/Helvetica.ttf" });
const Grenoble = LocalFontLoader({ variable: "--font-Grenoble", src: "./_utils/fonts/Grenoble.ttf" });

const Lora_Bold = LocalFontLoader({ variable: "--font-Lora_Bold", src: "./_utils/fonts/Lora/Lora_Bold.ttf" });
const Lora_BoldItalic = LocalFontLoader({ variable: "--font-Lora_BoldItalic", src: "./_utils/fonts/Lora/Lora_BoldItalic.ttf" });
const Lora_Italic = LocalFontLoader({ variable: "--font-Lora_Italic", src: "./_utils/fonts/Lora/Lora_Italic.ttf" });
const Lora_Medium = LocalFontLoader({ variable: "--font-Lora_Medium", src: "./_utils/fonts/Lora/Lora_Medium.ttf" });
const Lora_MediumItalic = LocalFontLoader({ variable: "--font-Lora_MediumItalic", src: "./_utils/fonts/Lora/Lora_MediumItalic.ttf" });
const Lora_Regular = LocalFontLoader({ variable: "--font-Lora_Regular", src: "./_utils/fonts/Lora/Lora_Regular.ttf" });
const Lora_SemiBold = LocalFontLoader({ variable: "--font-Lora_SemiBold", src: "./_utils/fonts/Lora/Lora_SemiBold.ttf" });
const Lora_SemiBoldItalic = LocalFontLoader({ variable: "--font-Lora_SemiBoldItalic", src: "./_utils/fonts/Lora/Lora_SemiBoldItalic.ttf" });

export const metadata: Metadata = { description: "Online Food Delivery and Order", title: "Sizzle & Spice" };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body
        className={`
          ${Helvetica.variable} 
          ${Helvetica_Rounded.variable} 
          ${Hatton_Bold.variable} 
          ${Brittany_Signature.variable} 
          ${Grenoble.variable} 
          ${MaronRose.variable} 
          ${LobsterTwo_Bold.variable} 
          ${Lora_Bold.variable} 
          ${Lora_BoldItalic.variable} 
          ${Lora_Italic.variable} 
          ${Lora_Medium.variable} 
          ${Lora_MediumItalic.variable} 
          ${Lora_Regular.variable} 
          ${Lora_SemiBold.variable} 
          ${Lora_SemiBoldItalic.variable} 
          font-Grenoble flex flex-col h-screen bg-[#ddd4cc] text-[#172B25]
        `}
      >
        <Providers>
          <AnimatedContentWrapper>{children}</AnimatedContentWrapper>
        </Providers>
      </body>
    </html>
  );
}
