<script lang="ts">
  import { page } from '$app/stores';

  import { browser } from '$app/environment';
  import { sendEvent } from '$lib/analytics/model';
  import ErrorBanner from '$lib/page/views/ErrorBanner.svelte';

  $: {
    if (browser) {
      sendEvent('package-not-found', {
        props: { reason: $page.error?.message || '' }
      });
    }
  }
</script>

<ErrorBanner subtitle="Package '{$page.error?.message}' doesn't exist" />
