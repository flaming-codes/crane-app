import { type Config } from "tailwindcss";
import { createPlugin as createRadixPalettePlugin } from "windy-radix-palette";
import baseFontSizePlugin from "tailwindcss-base-font-size";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  plugins: [createRadixPalettePlugin().plugin, baseFontSizePlugin],

  theme: {
    extend: {
      fontSize: {
        xxs: "0.5rem",
        xs: "0.75rem",
        base: "0.9rem",
        sm: "1rem",
        md: "1.125rem",
        lg: "1.3rem",
        xl: "1.8rem",
        "2xl": "2.5rem",
        "3xl": "3.5rem",
        "4xl": "4.5rem",
        "5xl": "6rem",
        "6xl": "8rem",
        "7xl": "10rem",
        "8xl": "12rem",
        "9xl": "14rem",
      },
      fontFamily: {
        sans: [
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "Oxygen",
          "Ubuntu",
          "Cantarell",
          "Fira Sans",
          "Droid Sans",
          "Helvetica Neue",
          "sans-serif",
        ],
      },
    },
  },
} satisfies Config;
