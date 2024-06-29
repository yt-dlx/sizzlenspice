// app/layout.tsx
import "./globals.css";
import type { Metadata } from "next";
import { Providers } from "./providers";
import LocalFontLoader from "next/font/local";
import AnimatedContentWrapper from "@/app/_utils/_components/AnimatedContentWrapper";

const Brittany_Signature = LocalFontLoader({ variable: "--font-Brittany_Signature", src: "./_utils/fonts/Brittany_Signature.otf" });
const Helvetica_Rounded = LocalFontLoader({ variable: "--font-Helvetica_Rounded", src: "./_utils/fonts/Helvetica_Rounded.otf" });
const Hatton_Bold = LocalFontLoader({ variable: "--font-Hatton_Bold", src: "./_utils/fonts/Hatton_Bold.otf" });
const MaronRose = LocalFontLoader({ variable: "--font-MaronRose", src: "./_utils/fonts/MaronRose.ttf" });
const Helvetica = LocalFontLoader({ variable: "--font-Helvetica", src: "./_utils/fonts/Helvetica.ttf" });
const Grenoble = LocalFontLoader({ variable: "--font-Grenoble", src: "./_utils/fonts/Grenoble.ttf" });

const LobsterTwo_Bold = LocalFontLoader({ variable: "--font-LobsterTwo_Bold", src: "./_utils/fonts/LobsterTwo_Bold.ttf" });
const LobsterTwo_Italic = LocalFontLoader({ variable: "--font-LobsterTwo_Italic", src: "./_utils/fonts/LobsterTwo_Italic.ttf" });
const LobsterTwo_Regular = LocalFontLoader({ variable: "--font-LobsterTwo_Regular", src: "./_utils/fonts/LobsterTwo_Regular.ttf" });
const LobsterTwo_BoldItalic = LocalFontLoader({ variable: "--font-LobsterTwo_BoldItalic", src: "./_utils/fonts/LobsterTwo_BoldItalic.ttf" });

export const metadata: Metadata = { description: "Online Food Delivery and Order", title: "Sizzle & Spice" };
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body
        className={`${Helvetica.variable} ${Helvetica_Rounded.variable} ${Hatton_Bold.variable} ${Brittany_Signature.variable} ${Grenoble.variable} ${MaronRose.variable} ${LobsterTwo_Bold.variable} ${LobsterTwo_Italic.variable} ${LobsterTwo_Regular.variable} ${LobsterTwo_BoldItalic.variable} font-Grenoble flex flex-col h-screen bg-[#ddd4cc] text-[#172B25]`}
      >
        <Providers>
          <AnimatedContentWrapper>{children}</AnimatedContentWrapper>
        </Providers>
      </body>
    </html>
  );
}
