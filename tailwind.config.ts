// tailwind.config.ts
import type { Config } from "tailwindcss";
const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        primary: "#DFD7C8",
        secondary: "#361D1D",
        tertiary: "#DBC5B6",
      },
      fontFamily: {
        Kurale: ["var(--font-Kurale)"],
        Brittany: ["var(--font-Brittany)"],
      },
    },
  },
  plugins: [
    require("daisyui"),
    require("preline/plugin"),
    require("flowbite/plugin"),
    require("@tailwindcss/forms"),
    require("@tailwindcss/typography"),
    require("tailwind-scrollbar-hide"),
    require("tailwind-scrollbar")({ nocompatible: true }),
  ],
};
export default config;
