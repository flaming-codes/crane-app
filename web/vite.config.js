import { sveltekit } from '@sveltejs/kit/vite';

/** @type {import('vite').UserConfig} */
const config = {
  plugins: [sveltekit()],
  optimizeDeps: {
    include: ['clsx']
  },
  test: {
    include: ['src/**/*.{test,spec}.{js,ts}']
  }
};

export default config;
