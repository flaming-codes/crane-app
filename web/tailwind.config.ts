import { type Config } from "tailwindcss";
import { createPlugin } from "windy-radix-palette";

const colors = createPlugin();

export default {
 content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
 theme: {
  extend: {
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
 plugins: [colors.plugin],
} satisfies Config;
