import adapter from '@sveltejs/adapter-vercel';
import { vitePreprocess } from '@sveltejs/kit/vite';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  // Consult https://github.com/sveltejs/svelte-preprocess
  // for more information about preprocessors
  preprocess: vitePreprocess({
    postcss: true,
    preserve: ['ld+json']
  }),
  kit: {
    adapter: adapter({
      edge: true
    }),
    csp: {
      directives: {
        'default-src': [
          'self',
          'https',
          'api.iconify.design',
          'plausible.io',
          'vitals.vercel-insights.com'
        ],
        'script-src': [
          'self',
          'https',
          'api.iconify.design',
          'vitals.vercel-insights.com',
          'plausible.io',
          'nonce-plausible-events'
        ],
        'style-src': ['self', 'fonts.googleapis.com'],
        'font-src': ['self', 'fonts.gstatic.com']
      }
    }
  }
};

export default config;
