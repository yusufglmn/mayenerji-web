import type { Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        lacivert: { DEFAULT: "#12355B", 900: "#0C2440", 700: "#12355B", 500: "#1E4E7E", 100: "#E7EEF6" },
        yesil:    { DEFAULT: "#2E7D32", 700: "#256428", 500: "#2E7D32", 400: "#4CA357", 100: "#E8F3E9" },
        gunes:    { DEFAULT: "#F5A623", 600: "#D98A0B", 100: "#FEF3E0" },
      },
      fontFamily: { sans: ["var(--font-sans)", "system-ui", "sans-serif"] },
      maxWidth: { site: "1200px" },
    },
  },
  plugins: [],
} satisfies Config;
