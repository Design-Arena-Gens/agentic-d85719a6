import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        midnight: {
          950: "#030712",
          900: "#080d1f",
          800: "#101b3b"
        },
        brass: {
          400: "#d9a441",
          500: "#c78f2b",
          600: "#ad7817"
        }
      },
      fontFamily: {
        display: ["'Playfair Display'", "serif"],
        body: ["'Inter'", "sans-serif"]
      },
      boxShadow: {
        glow: "0 0 35px rgba(215, 143, 43, 0.35)"
      }
    }
  },
  plugins: []
};

export default config;
