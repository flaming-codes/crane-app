import type { Config } from 'tailwindcss';
import defaultTheme from 'tailwindcss/defaultTheme';

export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Syne', ...defaultTheme.fontFamily.sans]
      },
      fontSize: {
        sml: '0.975rem'
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
  plugins: [require('tailwindcss-safe-area'), require('@tailwindcss/typography')]
} satisfies Config;
