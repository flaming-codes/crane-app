import type { Schema } from './types';

export function serializeSchema(thing: Schema) {
  // https://navillus.dev/blog/json-ld-in-sveltekit
  // https://json-ld.org/playground/
  return `<script type="application/ld+json">${JSON.stringify(thing, null, 2)}</script>`;
}

export async function fetchOgPosterImage(domain: 'author' | 'package', id?: string) {
  const url = new URL(`${import.meta.env.VITE_BASE_OG_POSTER_API_URL}/${domain}/${id}`);
  const res = await fetch(url.toString());

  return Buffer.from(await res.arrayBuffer());
}
