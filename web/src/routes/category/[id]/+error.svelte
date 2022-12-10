<script lang="ts">
  import { page } from '$app/stores';

  import { browser } from '$app/environment';
  import { sendEvent } from '$lib/analytics/model';
  import ErrorBanner from '$lib/page/views/ErrorBanner.svelte';

  $: {
    if (browser) {
      sendEvent('category-not-found', {
        props: { reason: $page.error?.message || 'unknown' }
      });
    }
  }
</script>

<ErrorBanner subtitle="Category {$page.error?.message} doesn't exist" />
