import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: "#FBF3E4",
        "paper-2": "#F6EAD4",
        card: "#FFFDF8",
        ink: "#2E2418",
        "ink-soft": "#6B5D4A",
        "ink-faint": "#9A8A72",
        line: "#E6D7BD",
        "line-soft": "#EFE3CB",
        orange: "#E8743B",
        "orange-deep": "#CE5C26",
        "orange-tint": "#FBE2D2",
        green: "#2E8B6F",
        "green-deep": "#226C56",
        "green-tint": "#D6EBE2",
        blue: "#3A5A8C",
        "blue-deep": "#2C476E",
        "blue-tint": "#DCE4F0",
        plum: "#7C6A9C",
        gold: "#E2A93B",
      },
      fontFamily: {
        serif: ['"Young Serif"', "Georgia", "serif"],
        sans: ["Mulish", "system-ui", "-apple-system", "sans-serif"],
      },
      borderRadius: {
        sm: "8px",
        DEFAULT: "14px",
        lg: "22px",
        xl: "32px",
        pill: "999px",
      },
      boxShadow: {
        s: "0 1px 2px rgba(70,50,20,.06), 0 2px 6px rgba(70,50,20,.05)",
        m: "0 2px 6px rgba(70,50,20,.07), 0 10px 24px rgba(70,50,20,.08)",
        l: "0 6px 16px rgba(70,50,20,.10), 0 24px 50px rgba(70,50,20,.12)",
      },
      maxWidth: {
        container: "1200px",
      },
    },
  },
  plugins: [],
};

export default config;
