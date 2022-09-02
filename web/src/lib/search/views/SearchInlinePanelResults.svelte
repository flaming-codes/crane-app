<script lang="ts">
  import { store } from '$lib/search/stores/search';

  import { browser } from '$app/environment';
  import clsx from 'clsx';
  import SearchResults from './SearchResults.svelte';

  const { isInputFocused, hits, input } = store;
  const { items, total, page, size, isEnd } = hits;

  /** Flag to indicate by parent if element should be usable. */
  export let isEnabled: boolean | undefined = undefined;

  /** Cached previous overflow-y value from document, as we're setting a body scroll lock.*/
  let prevOverflowY: string | undefined = undefined;
  /** Flag to indicate if the panel is visible and available for interaciton. */
  let isVisible = false;

  // Effect to set visibility of the panel.
  $: {
    if (isEnabled) {
      if (!isVisible && $isInputFocused && $items?.length > 0) {
        isVisible = true;
      }
      if (isVisible && !$input) {
        isVisible = false;
      }
    }
  }

  // Body scroll lock effect.
  $: {
    if (browser && isEnabled && isVisible) {
      prevOverflowY = document.body.style.overflowY || 'auto';
      document.body.style.overflowY = 'hidden';
    }
    if (browser && prevOverflowY && !isVisible) {
      document.body.style.overflowY = prevOverflowY;
      prevOverflowY = undefined;
    }
  }
</script>

<div
  class={clsx(
    'fixed left-0 right-0 bottom-0 h-screen z-[1] pb-10 overflow-y-auto',
    'backdrop-blur-xl bg-zinc-900/80 border-t border-neutral-700',
    'transition duration-500 ease-in-out',
    'motion-reduce:transition-none',
    {
      'translate-y-full': !isVisible
    }
  )}
>
  <SearchResults
    theme="dark"
    initialAll={{
      hits: $items,
      total: $total,
      page: $page,
      size: $size,
      isEnd: $isEnd
    }}
  />
</div>
