import { dev } from '$app/environment';
import { writable } from 'svelte/store';

export const store = {
  state: writable<'init' | 'ready' | 'searching'>('init'),
  input: writable(''),
  hits: getPaginationStore<any>({ items: [] }),
  typeAheadState: writable<'init' | 'ready' | 'unavailable'>(dev ? 'ready' : 'init'),
  isInputFocused: writable(false)
};

function getPaginationStore<T>(params?: { items?: T[] }) {
  const { items } = params || {};

  return {
    items: writable(items),
    page: writable(0),
    size: writable(50),
    total: writable(0),
    isEnd: writable(false)
  };
}
