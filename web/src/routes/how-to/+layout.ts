import type { Config } from '@sveltejs/kit';

export const config: Config = {
  isr: {
    expiration: 60 * 60 * 24 * 7 // 1 week
  }
};
