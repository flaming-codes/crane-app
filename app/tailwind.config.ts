import type { Config } from "tailwindcss";
import radixColors from "tailwindcss-radix-colors";
// @ts-expect-error - no types.
import bgPatterns from "tailwindcss-bg-patterns";
import animated from "tailwindcss-animated";

export default {
  content: ["./app/**/{**,.client,.server}/**/*.{js,jsx,ts,tsx}"],
  darkMode: "media",
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "system-ui",
          "ui-sans-serif",
          "Helvetica",
          "sans-serif",
          '"Apple Color Emoji"',
          '"Segoe UI Emoji"',
          '"Segoe UI Symbol"',
          '"Noto Color Emoji"',
        ],
      },
    },
  },
  plugins: [radixColors, bgPatterns, animated],
} satisfies Config;
