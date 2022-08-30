import type { Schema } from './types';

export function serializeSchema(thing: Schema) {
  // https://navillus.dev/blog/json-ld-in-sveltekit
  // https://json-ld.org/playground/
  return `<script type="application/ld+json">${JSON.stringify(thing, null, 2)}</script>`;
}
