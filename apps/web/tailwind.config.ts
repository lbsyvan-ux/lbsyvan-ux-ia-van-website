import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        kapex: {
          gold: {
            DEFAULT: "#C5A021",
            light: "#D4AF37",
            dark: "#997A16",
          },
          black: "#0A0A0A",
          gray: "#1A1A1A",
        },
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "Inter", "sans-serif"],
        serif: ["var(--font-geist-serif)", "serif"],
      },
    },
  },
  plugins: [],
};
export default config;
