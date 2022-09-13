<script lang="ts">
  import { browser } from '$app/environment';
  import Button from '$lib/display/views/Button.svelte';

  let cn: string | undefined = undefined;
  export { cn as class };

  let isOptOut = false;
  $: {
    if (browser) {
      isOptOut = localStorage.plausible_ignore === 'true';
    }
  }
</script>

<Button
  size="sm"
  title={`${isOptOut ? 'Enable' : 'Disable'} Plausible.io`}
  ariaLabel="Disable or enable any privacy-first analytics"
  class={cn}
  on:click={() => {
    if (isOptOut) localStorage.removeItem('plausible_ignore');
    else localStorage.setItem('plausible_ignore', 'true');
    isOptOut = !isOptOut;
    window.location.reload();
  }}
>
  {`${isOptOut ? 'Enable' : 'Disable'} Plausible.io`}
</Button>
