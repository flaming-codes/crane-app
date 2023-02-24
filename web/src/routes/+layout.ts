import type { Config } from '@sveltejs/kit';

export const config: Config = {
  runtime: 'edge',
  isr: {
    expiration: 60 // 1 minute
  }
};
