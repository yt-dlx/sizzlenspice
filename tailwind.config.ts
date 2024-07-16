// tailwind.config.ts
import type { Config } from "tailwindcss";
const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        primary: "#F3E8DA",
        secondary: "#131F1A",
        tertiary: "#A8B67C",
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
