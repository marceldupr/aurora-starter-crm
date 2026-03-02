import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        aurora: {
          bg: "#0a0e17",
          surface: "rgba(30, 41, 59, 0.6)",
          "surface-hover": "rgba(51, 65, 85, 0.6)",
          border: "rgba(148, 163, 184, 0.15)",
          accent: "var(--aurora-accent, #38bdf8)",
          muted: "rgba(248, 250, 252, 0.7)",
        },
      },
      borderRadius: {
        container: "20px",
        card: "16px",
        component: "12px",
      },
    },
  },
  plugins: [],
};

export default config;
