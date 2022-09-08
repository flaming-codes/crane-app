<script lang="ts">
  import '../app.css';
  import '../fonts.css';
  import { browser, dev } from '$app/environment';
  import { proxy, wrap } from 'comlink';
  import { onMount } from 'svelte';

  if (!dev) {
    const noop = () => {};
    console.log = noop;
    console.warn = noop;
    console.error = noop;
    console.info = noop;
  }

  const releaseChannel = import.meta.env.VITE_RELEASE_CHANNEL;

  let syncWorker: Worker | undefined = undefined;
  const loadWorker = async () => {
    const SyncWorker = await import('$lib/db/ta.worker?worker');
    syncWorker = new SyncWorker.default();
  };

  async function debug() {
    await loadWorker();
    const Db = wrap(syncWorker!);
    // @ts-expect-error
    const db = await new Db();
    console.log('worker', await db.doWork());
  }

  onMount(() => {
    if (browser) {
      debug();
    }
  });
</script>

<svelte:head>
  {#if browser && releaseChannel === 'production'}
    <script defer data-domain="cran-e.com" src="https://plausible.io/js/plausible.js"></script>
    <script nonce="plausible-events">
      if (window !== 'undefined') {
        window.plausible =
          window.plausible ||
          function () {
            (window.plausible.q = window.plausible.q || []).push(arguments);
          };
      }
    </script>
  {/if}
</svelte:head>

<slot />
