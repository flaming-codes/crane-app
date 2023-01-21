import { writable } from 'svelte/store';
import type { Intel } from '../types';

const _store = {
  queue: writable<Intel[]>([])
};

export const store = {
  ..._store,

  push(q: Intel[], action: Intel) {
    if (!q.find(({ type, value }) => type === action.type && value === action.value)) {
      this.queue.update((queue) => [action, ...queue]);
    }
  }
};
