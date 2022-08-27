<script lang="ts">
  import { store } from '$lib/search/stores/search';

  import clsx from 'clsx';
  import { shortcut } from '$lib/input/models/shortcut';
  import { browser } from '$app/environment';
  import { onDestroy, onMount } from 'svelte';
  import Kbd from '$lib/blocks/views/Kbd.svelte';
  import type { TAItem } from 'src/sw/types';
  import Iconic from '$lib/blocks/views/Iconic.svelte';

  const { state, input, typeAheadState, isInputFocused } = store;

  export let theme: 'light' | 'dark' = 'dark';
  let suggestion: TAItem | {} = {};
  let isFirstUse: boolean;
  let inputNode: HTMLInputElement | null;

  const listenToServiceWorker = ({ data }: any) => {
    if (data.type === 'lifecycle' && data.payload === 'activated') {
      console.timeEnd('sw');
      localStorage.setItem('sw-activated', 'true');
      $typeAheadState = 'ready';
    }
  };

  onMount(() => {
    isFirstUse = browser && localStorage.getItem('hint-search-shortcut') === null;

    if ($typeAheadState === 'ready') {
      return;
    }

    // TODO: This shadows every subsequent update to the SW.
    // We're fine with it for now (no spinner when SW updates DB),
    // only IndexDB can be used to reliably communicate the state.
    if (localStorage.getItem('sw-activated') !== null) {
      $typeAheadState = 'ready';
      return;
    }

    if (browser && 'navigator' in window && 'serviceWorker' in navigator) {
      console.time('sw');
      navigator.serviceWorker.addEventListener('message', listenToServiceWorker);
    } else {
      $typeAheadState = 'unavailable';
    }
  });

  onDestroy(() => {
    if (browser) {
      navigator.serviceWorker.removeEventListener('message', listenToServiceWorker);
    }
  });

  const onEnter = () => {
    if ('id' in suggestion) {
      input.set(suggestion.id);
      // goto(`/package/${suggestion.id}`);
      window.location.href = `/package/${suggestion.slug}`;
    }
  };

  const onDismiss = () => {
    inputNode?.blur();
    $input = '';
    $isInputFocused = false;
  };

  $: {
    if (browser && $typeAheadState === 'ready') {
      if ($input) {
        const url = new URL('/api/package/ta', window.location.origin);
        url.searchParams.set('q', $input.toLowerCase());

        fetch(url)
          .then((res) => res.json())
          .then((res) => {
            suggestion = res as any;
          });
      } else {
        suggestion = {};
      }
    }
  }

  $: {
    if ($isInputFocused && isFirstUse) {
      isFirstUse = false;
      localStorage.setItem('hint-search-shortcut', 'true');
    }
  }

  $: placeholder = $state === 'ready' ? (isFirstUse ? '' : 'Enter search...') : 'Loading...';
</script>

<div class="flex-1 flex flex-row-reverse items-center gap-x-2">
  <div
    class={clsx({
      'relative flex-1 flex items-center h-full': true,
      'font-mono text-[14px]': true
    })}
  >
    <span aria-hidden="true" class="absolute flex items-center opacity-40 -z-0 pl-3">
      {#if 'id' in suggestion}
        <span class="lowercase">
          {suggestion.id.replace($input, [...$input].join(''))}
        </span>
        <span class="ml-10 space-x-1 flex items-center">
          <Kbd inline text="Enter" {theme} withLowOpacity={false} />
          <Iconic hFlip name="carbon:text-new-line" size="16" />
        </span>
      {/if}
      {#if !placeholder && !('id' in suggestion)}
        <span class="flex items-center ">
          Hit<Kbd inline text=":meta: F" {theme} />to focus search
        </span>
      {/if}
    </span>

    <input
      title="Search"
      role="search"
      bind:value={$input}
      bind:this={inputNode}
      class={clsx(
        `
        absolute peer bg-transparent w-full h-full lowercase opacity-100 pl-3
        border-none focus:ring-0 focus:border-transparent focus:outline-none
      `,
        {
          'placeholder:text-neutral-700': theme === 'light',
          'placeholder:text-neutral-300': theme === 'dark'
        }
      )}
      on:focus={() => isInputFocused.set(true)}
      on:blur={() => isInputFocused.set(false)}
      on:keydown={(e) => {
        if (e.key === 'Enter' || e.code === 'Enter') {
          onEnter();
          return;
        }
        if ((e.key === 'Tab' || e.code === 'Tab') && $input) {
          e.preventDefault();
          if ($isInputFocused && 'id' in suggestion) {
            $input = suggestion.id;
          }
          return;
        }
      }}
      use:shortcut={{ control: true, code: 'KeyF', callback: ({ node }) => node.focus() }}
      use:shortcut={{
        code: 'Escape',
        callback: () => onDismiss()
      }}
      {placeholder}
    />
  </div>

  {#if !$isInputFocused}
    <button
      aria-label="Focus search input"
      title="Focus search input"
      on:click={() => inputNode?.focus()}
    >
      <Iconic name="carbon:search" size="20" />
    </button>
  {/if}
  {#if $isInputFocused && !$input}
    <Iconic name="carbon:search-locate" size="20" />
  {/if}
  {#if $input}
    <button aria-label="Reset search" on:click={() => onDismiss()}>
      <Iconic name="carbon:close-filled" size="20" />
    </button>
  {/if}
</div>
