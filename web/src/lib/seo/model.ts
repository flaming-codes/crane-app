import { chromium } from 'playwright';
import type { Schema } from './types';

export function serializeSchema(thing: Schema) {
  // https://navillus.dev/blog/json-ld-in-sveltekit
  // https://json-ld.org/playground/
  return `<script type="application/ld+json">${JSON.stringify(thing, null, 2)}</script>`;
}

export async function generateOgPosterImage(domain: 'author' | 'package', id?: string) {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  const url = new URL(`${import.meta.env.VITE_BASE_URL}/${domain}/${id}/poster`);

  await page.setViewportSize({ width: 1200, height: 630 });
  await page.goto(url.toString());

  // Fonts may not be loaded yet, so wait a bit.
  await page.waitForTimeout(200);

  // TODO: Maybe use image optimization?
  // @link https://www.npmjs.com/package/jimp
  const imageBuffer = await page.screenshot();

  await browser.close();

  return imageBuffer;
}
