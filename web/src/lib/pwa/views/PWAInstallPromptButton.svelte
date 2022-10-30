<script lang="ts">
  import { browser } from '$app/environment';
  import { sendEvent } from '$lib/analytics/model';
  import Iconic from '$lib/blocks/views/Iconic.svelte';
  import { onMount, onDestroy } from 'svelte';

  let cn: string | undefined = undefined;
  export { cn as class };

  let defferedEvent: any = undefined;
  let isInstallPossible: boolean = false;

  const onBeforeInstallPrompt = (e: Event) => {
    defferedEvent = e;
    isInstallPossible = true;
  };

  const onInstall = () => {
    defferedEvent.prompt();
    isInstallPossible = false;
    sendEvent('install-pwa');
  };

  onMount(() => {
    if (browser) {
      window.addEventListener('beforeinstallprompt', onBeforeInstallPrompt);
    }
  });

  onDestroy(() => {
    if (browser) {
      window.removeEventListener('beforeinstallprompt', onBeforeInstallPrompt);
    }
  });
</script>

{#if isInstallPossible}
  <button class={cn} aria-label="Show install prompt for CRAN/E" on:click={onInstall}>
    <Iconic name="carbon:download" size="20" />
  </button>
{/if}
