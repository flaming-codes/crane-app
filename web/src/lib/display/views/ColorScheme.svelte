<script lang="ts">
  import { browser } from '$app/environment';
  import { onDestroy, onMount } from 'svelte';

  export let scheme: 'light' | 'dark';

  let previousColorScheme: string | undefined;

  onMount(() => {
    if (browser) {
      previousColorScheme = document.documentElement.style.getPropertyValue('color-scheme');
      document.documentElement.style.setProperty('color-scheme', scheme);
    }
  });

  onDestroy(() => {
    if (browser) {
      document.documentElement.style.setProperty('color-scheme', previousColorScheme || '');
    }
  });
</script>
