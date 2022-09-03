const defaultTheme = require('tailwindcss/defaultTheme');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Syne', ...defaultTheme.fontFamily.sans]
      },
      screens: {
        xs: '375px',
        smx: '480px'
      },
      spacing: {
        nav: 'var(--base-controls-h-sm)'
      }
    }
  },
  plugins: [
    require('@tailwindcss/line-clamp'),
    require('tailwindcss-safe-area'),
    require('@tailwindcss/typography')
  ]
};
