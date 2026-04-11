import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        agri: {
          bg: "#0a0f0a",
          surface: "#111811",
          card: "#141f14",
          border: "#1e2e1e",
          primary: "#4ade80",
          primaryDark: "#166534",
          amber: "#fbbf24",
          red: "#f87171",
          blue: "#60a5fa",
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
