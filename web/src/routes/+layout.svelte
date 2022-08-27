<script lang="ts">
  import '../app.css';
  import { dev } from '$app/environment';

  if (!dev) {
    const noop = () => {};
    console.log = noop;
    console.warn = noop;
    console.error = noop;
    console.info = noop;
  }

  const microIoId = import.meta.env.VITE_MICRO_IO_KEY;
  const releaseChannel = import.meta.env.VITE_RELEASE_CHANNEL;
</script>

<svelte:head>
  {#if releaseChannel === 'production'}
    <script
      async
      defer
      data-host="https://microanalytics.io"
      data-dnt="false"
      src="https://microanalytics.io/js/script.js"
      id={microIoId}></script>
  {/if}
</svelte:head>

<slot />
