const defaultTheme = require('tailwindcss/defaultTheme');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Syne', ...defaultTheme.fontFamily.sans],
        mono: ['Spline Sans Mono', ...defaultTheme.fontFamily.mono]
      }
    }
  },
  plugins: [
    require('@tailwindcss/line-clamp'),
    require('tailwindcss-safe-area'),
    require('@tailwindcss/typography')
  ]
};
