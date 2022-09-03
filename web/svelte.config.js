import adapter from '@sveltejs/adapter-vercel';
import preprocess from 'svelte-preprocess';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  // Consult https://github.com/sveltejs/svelte-preprocess
  // for more information about preprocessors
  preprocess: preprocess({
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
          'plausible.io'
        ],
        'style-src': ['self', 'fonts.googleapis.com'],
        'font-src': ['self', 'fonts.gstatic.com']
      }
    }
  }
};

export default config;
