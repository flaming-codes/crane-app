<script lang="ts">
  import { store } from '$lib/search/stores/search';

  import PackageLink from '$lib/package/views/PackageLink.svelte';
  import clsx from 'clsx';
  import { onMount } from 'svelte';
  import { browser } from '$app/environment';
  import { goto } from '$app/navigation';
  import Iconic from '$lib/blocks/views/Iconic.svelte';
  import Link from '$lib/display/views/Link.svelte';
  import SearchHitItem from './SearchHitItem.svelte';

  const { input, state, authors, isInputFocused } = store;
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

    const generateUrl = (href: string) => {
      const url = new URL(href, window.location.href);
      url.searchParams.set('page', `${$page + 1}`);
      url.searchParams.set('size', `${$size}`);

      if ($input) {
        url.searchParams.set('q', $input);
      } else {
        url.searchParams.set('all', 'true');
      }

      return url;
    };

    const urls = [
      generateUrl('/api/package/overview').toString(),
      generateUrl('/api/author/overview').toString()
    ];

    await Promise.all(urls.map((url) => fetch(url)))
      .then((res) => Promise.all(res.map((r) => r.json())))
      .then(([pkgs, author]) => {
        $hitItems = params?.isReset ? pkgs.hits : [...$hitItems, ...pkgs.hits];
        $page = pkgs.page;
        $size = pkgs.size;
        $total = pkgs.total;
        $isEnd = pkgs.isEnd;
        $authors = author.hits;
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
      $authors = [];
    }
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
    $authors = [];
    state.set('ready');
  });
</script>

<div
  class={`
    grid grid-cols-2 p-2 gap-x-2 gap-y-4
    sm:grid-cols-3 sm:p-3
    lg:grid-cols-4 lg:p-4 lg:gap-y-8
    xl:grid-cols-5 xl:gap-4 xl:gap-y-8
    2xl:grid-cols-6 2xl:gap-8
  `}
>
  <!--
    TODO: Workaround instead of '$authors.length' as scroll-margin-top won't apply after initial movement. 

    I.e. once the 'goto(#packages') is called, this section is hidden in case the authors' result comes
    in later - which is almost alwayys the case. As a quickfix, we show an empty space that's filled w/
    the authors' result once it comes in.
    -->
  {#if Boolean($input)}
    <section class={clsx('h-12 col-span-full flex gap-x-4 overflow-x-auto overflow-y-hidden')}>
      {#each $authors as { name, slug, totalPackages }}
        <Link withForcedReload href="/author/{slug}" class="flex flex-col flex-shrink-0">
          <SearchHitItem {theme} class="h-auto">
            <span class="flex text-base items-center gap-x-1"
              ><Iconic name="carbon:user-avatar" size="16" /> {name}</span
            >
            <span class="opacity-50 text-sm"
              >{totalPackages} {totalPackages === 1 ? 'package' : 'packages'}</span
            >
          </SearchHitItem>
        </Link>
      {/each}
    </section>
    <hr
      class={clsx('col-span-full', {
        'opacity-80': !theme || theme === 'light',
        'opacity-20': theme === 'dark'
      })}
    />
  {/if}
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
        <Iconic name="carbon:repeat" size="20" />
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
