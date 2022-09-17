import { writable } from 'svelte/store';

export const store = {
  worker: writable<Worker | undefined>(),
  proxy: writable<any | undefined>()
};
