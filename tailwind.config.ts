import type { Config } from "tailwindcss";

const config: Config = {
  // PENTING: Wajib tambahkan baris ini agar Tailwind membaca class .dark dari next-themes
  darkMode: "class", 
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};

export default config;