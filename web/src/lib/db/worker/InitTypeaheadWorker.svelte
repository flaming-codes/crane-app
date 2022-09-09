<script lang="ts">
  import { store } from './ta.store';

  import { wrap } from 'comlink';
  import { onMount } from 'svelte';
  import { browser } from '$app/environment';

  const { worker, proxy } = store;

  const loadWorker = async () => {
    if (!$worker) {
      console.warn('Worker will be created');

      const TaDbWorker = await import('$lib/db/worker/ta.worker?worker');
      $worker = new TaDbWorker.default();
    } else {
      console.warn('+ Worker already exists');
    }

    if (!$proxy) {
      const Proxy = wrap($worker!);
      // @ts-expect-error
      $proxy = await new Proxy();
      console.log('worker', await $proxy.initIfNeeded());
    }
  };

  onMount(() => {
    if (browser) {
      loadWorker();
    }
  });
</script>
