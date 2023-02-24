import type { Config } from '@sveltejs/kit';

export const config: Config = {
  isr: {
    expiration: 60 // 1 minute
  }
};
