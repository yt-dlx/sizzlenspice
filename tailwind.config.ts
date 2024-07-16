// tailwind.config.ts
import type { Config } from "tailwindcss";
const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        primary: "#E9F0CD",
        secondary: "#131F1A",
        tertiary: "#A8B67C",
      },
      fontFamily: {
        Kurale: ["var(--font-Kurale)"],
        Brittany: ["var(--font-Brittany)"],
        Grenoble: ["var(--font-Grenoble)"],
        Playfair: ["var(--font-Playfair)"],
        Merriweather: ["var(--font-Merriweather)"],
        RobotoCondensed: ["var(--font-RobotoCondensed)"],
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
