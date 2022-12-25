import captureWebsite from 'capture-website';
import type { Schema } from './types';

export function serializeSchema(thing: Schema) {
  // https://navillus.dev/blog/json-ld-in-sveltekit
  // https://json-ld.org/playground/
  return `<script type="application/ld+json">${JSON.stringify(thing, null, 2)}</script>`;
}

export async function generateOgPosterImage(domain: 'author' | 'package', id?: string) {
  const url = new URL(`${import.meta.env.VITE_BASE_URL}/${domain}/${id}/poster`);

  const imageBuffer = await captureWebsite.buffer(url.toString(), {
    type: 'jpeg',
    width: 1200,
    height: 630,
    delay: 0.2,
    quality: 0.8
  });

  return imageBuffer;
}
