<script lang="ts">
  import '../app.css';
  import '../fonts.css';
  import { browser, dev } from '$app/environment';

  if (!dev) {
    const noop = () => {};
    console.log = noop;
    console.warn = noop;
    console.error = noop;
    console.info = noop;
  }

  const releaseChannel = import.meta.env.VITE_RELEASE_CHANNEL;
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
