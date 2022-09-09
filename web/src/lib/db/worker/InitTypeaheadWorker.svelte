<script lang="ts">
  import { store } from './ta.store';
  import { store as searchStore } from '$lib/search/stores/search';

  import { wrap } from 'comlink';
  import { onMount } from 'svelte';
  import { browser } from '$app/environment';
  import { get } from 'idb-keyval';

  const { worker, proxy } = store;
  const { typeAheadState } = searchStore;

  const loadWorker = async () => {
    if (!$worker) {
      const TaDbWorker = await import('$lib/db/worker/ta.worker?worker');
      $worker = new TaDbWorker.default();
    }

    if (!$proxy) {
      const Proxy = wrap($worker!);
      // @ts-expect-error
      $proxy = await new Proxy();
      await $proxy.initIfNeeded();
    }
  };

  onMount(async () => {
    if (browser) {
      if (!('Worker' in window)) {
        $typeAheadState = 'unavailable';
        return;
      }

      const cacheKey = 'ta-db-timestamp';
      const cache = await get(cacheKey);

      if (cache) {
        $typeAheadState = 'ready';
      } else {
        $typeAheadState = 'init';
        console.time('ta-db');
      }

      await loadWorker();

      // If no cache was available at start,
      // we have to end the timer for logging.
      if (!cache) {
        console.timeEnd('ta-db');
      }
      $typeAheadState = 'ready';
    }
  });
</script>
