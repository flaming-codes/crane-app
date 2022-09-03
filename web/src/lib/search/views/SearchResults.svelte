<script lang="ts">
  import { store } from '$lib/search/stores/search';
  import {
    store as focusTrapStore,
    disableInteractionOnFocusEffect
  } from '$lib/search/stores/disable-interaction';

  import PackageLink from '$lib/package/views/PackageLink.svelte';
  import clsx from 'clsx';
  import { onMount } from 'svelte';
  import { browser } from '$app/environment';
  import { goto } from '$app/navigation';
  import Iconic from '$lib/blocks/views/Iconic.svelte';

  const { input, state, isInputFocused } = store;
  const { items: hitItems, page, size, total, isEnd } = store.hits;

  type InitialAll = {
    hits: any[];
    total: number;
    page: number;
    size: number;
    isEnd: boolean;
  };

  export let initialAll: InitialAll;
  export let theme: 'light' | 'dark' | undefined = undefined;

  export let withHashEffect: boolean | undefined = undefined;
  export let withScrollTopEffect: boolean | undefined = undefined;

  async function fetchNext(params?: { isReset?: boolean }) {
    state.set('searching');

    const url = new URL('/api/package', window.location.href);
    url.searchParams.set('page', `${$page + 1}`);
    url.searchParams.set('size', `${$size}`);

    if ($input) {
      url.searchParams.set('q', $input);
    } else {
      url.searchParams.set('all', 'true');
    }

    await fetch(url.toString())
      .then((res) => res.json())
      .then((res) => {
        $hitItems = params?.isReset ? res.hits : [...$hitItems, ...res.hits];
        $page = res.page;
        $size = res.size;
        $total = res.total;
        $isEnd = res.isEnd;
      })
      .finally(() => {
        state.set('ready');
      });
  }

  let timer: NodeJS.Timeout;
  $: {
    clearTimeout(timer);

    if (browser && $input) {
      timer = setTimeout(() => {
        state.set('searching');

        if (withHashEffect) {
          goto('#packages', {
            keepfocus: true
          });
        }

        $page = -1;
        $size = 50;

        fetchNext({ isReset: true });
      }, 200);
    }
  }

  $: {
    if (browser && !$input && window.location.hash !== '') {
      if (withHashEffect) {
        goto('/', {
          keepfocus: true
        });
      }

      $hitItems = initialAll.hits;
      $page = initialAll.page;
      $size = initialAll.size;
      $total = initialAll.total;
      $isEnd = initialAll.isEnd;
    }
  }

  const { isInteractionEnabled, isTrapped } = focusTrapStore;

  $: {
    void $isInteractionEnabled;
    void $isTrapped;
    void $isInputFocused;
    disableInteractionOnFocusEffect();
  }

  onMount(async () => {
    if (browser && withScrollTopEffect) {
      window.scrollTo(0, 0);
    }

    $hitItems = initialAll.hits;
    $page = initialAll.page;
    $size = initialAll.size;
    $total = initialAll.total;
    $isEnd = initialAll.isEnd;
    state.set('ready');
  });
</script>

<div
  class={clsx(
    `
    grid grid-cols-2 p-2 gap-x-2 gap-y-4
    sm:grid-cols-3 sm:p-3
    lg:grid-cols-4 lg:p-4 lg:gap-y-8
    xl:grid-cols-5 xl:gap-4 xl:gap-y-8
    2xl:grid-cols-6 2xl:gap-8`,
    {
      'cursor-none pointer-events-none': !$isInteractionEnabled
    }
  )}
>
  {#if !$input}
    <p class="col-span-full px-4 py-1 text-zinc-700">Packages by date of publication</p>
  {/if}
  {#each $hitItems as item}
    <PackageLink {item} {theme} />
  {/each}
  <div class="h-32 lg:h-28">
    <button
      on:click={() => fetchNext()}
      disabled={$state === 'searching' || $isEnd}
      class={clsx({
        'group h-full w-full flex flex-col justify-center items-center font-bold text-2xl space-y-1': true,
        'animate-pulse': $state === 'searching'
      })}
    >
      {#if !$isEnd}
        <Iconic name="carbon:repeat-one" size="20" />
      {/if}
      <span
        class={clsx({
          'font-mono uppercase text-xs font-normal': true,
          'group-hover:underline underline-offset-4': $state === 'ready' && !$isEnd
        })}
      >
        {#if $isEnd}
          No more results
        {:else if $state === 'searching'}
          Loading {$size * ($page + 1)} of {$total}
        {:else}
          Load more
        {/if}
      </span>
    </button>
  </div>
</div>
