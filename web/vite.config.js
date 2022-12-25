import { sveltekit } from '@sveltejs/kit/vite';

/** @type {import('vite').UserConfig} */
const config = {
  plugins: [sveltekit()],
  optimizeDeps: {
    include: ['@headlessui/react', 'clsx'],
    needsInterop: [
      'capture-website',
      'readable-stream',
      'fd-slicer',
      'tar-fs',
      'yauzl',
      'https-proxy-agent',
      'agent-base'
    ]
  },
  test: {
    include: ['src/**/*.{test,spec}.{js,ts}']
  }
};

export default config;
