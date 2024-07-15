// tailwind.config.ts
import type { Config } from "tailwindcss";
const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        primary: "#1C3029",
        secondary: "#E9F0CD",
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
