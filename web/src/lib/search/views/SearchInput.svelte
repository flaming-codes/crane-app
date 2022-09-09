<script lang="ts">
  import { store } from '$lib/search/stores/search';
  import { store as taStore } from '$lib/db/worker/ta.store';

  import clsx from 'clsx';
  import { shortcut } from '$lib/input/models/shortcut';
  import { browser } from '$app/environment';
  import { onMount } from 'svelte';
  import Kbd from '$lib/blocks/views/Kbd.svelte';
  import Iconic from '$lib/blocks/views/Iconic.svelte';
  import MediaQuery from 'svelte-media-queries';
  import InitTypeaheadWorker from '$lib/db/worker/InitTypeaheadWorker.svelte';
  import type { TAItem } from '$lib/db/adapters/types';

  const { state, input, typeAheadState, isInputFocused } = store;
  const { proxy: taProxy } = taStore;

  export let theme: 'light' | 'dark' = 'dark';
  let suggestion: TAItem | {} = {};
  let isFirstUse: boolean;
  let inputNode: HTMLInputElement | null;

  let offset = 0;
  $: {
    void $input;
    offset = 0;
  }

  let matches: boolean | undefined = undefined;
  $: isMobile = Boolean(matches);

  onMount(() => {
    isFirstUse = browser && localStorage.getItem('hint-search-shortcut') === null;
  });

  const onEnter = () => {
    if ('id' in suggestion) {
      input.set(suggestion.id);
      window.location.href = `/package/${suggestion.slug}`;
    }

    // Hide keyboard on mobile on enter.
    if (isMobile) {
      inputNode?.blur();
    }
  };

  const onDismiss = () => {
    inputNode?.blur();
    $input = '';
    $isInputFocused = false;
  };

  $: {
    if (browser && $typeAheadState === 'ready') {
      if ($input && $taProxy) {
        $taProxy.query($input).then((hits: TAItem[]) => {
          suggestion = hits[offset % hits.length];
        });
      } else {
        suggestion = {};
      }
    }
  }

  $: {
    if ($isInputFocused) {
      // TODO: App freezes when a fragment is part of the URL and input is provided.
      // This is a workaround which removes fragment from the URL.
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }

  $: {
    if ($isInputFocused && isFirstUse) {
      isFirstUse = false;
      localStorage.setItem('hint-search-shortcut', 'true');
    }
  }

  $: placeholder = $state === 'ready' ? (isFirstUse ? '' : 'enter search...') : 'loading...';
</script>

<MediaQuery query="(max-width: 480px)" bind:matches />
<InitTypeaheadWorker />

<div class="flex-1 flex flex-row-reverse items-center gap-x-2">
  <div class="relative flex-1 flex items-center h-full font-mono text-[14px]">
    <span aria-hidden="true" class="absolute flex items-center opacity-40 -z-0">
      {#if 'id' in suggestion}
        <span
          class="w-[clamp(50px,35vw,400px)] sm:w-auto pl-2 lowercase truncate overflow-x-hidden flex-shrink"
        >
          {suggestion.id.replace($input, [...$input].join(''))}
        </span>
        {#if $isInputFocused}
          <span class="ml-5 space-x-1 flex items-center flex-shrink-0">
            <Kbd inline class="hidden smx:inline" text="Enter" {theme} withLowOpacity={false} />
            <Iconic hFlip name="carbon:text-new-line" size="16" />
          </span>
        {/if}
      {/if}
      {#if !placeholder && !('id' in suggestion)}
        <span class="sm:hidden"> enter search </span>
        <span class="hidden sm:flex items-center">
          Hit<Kbd inline text=":meta: K" {theme} />to focus search
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
        absolute peer bg-transparent w-full h-full lowercase opacity-100 pl-2
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
        if ((e.key === 'ArrowDown' || e.code === 'ArrowDown') && $input) {
          e.preventDefault();
          if ($isInputFocused && 'id' in suggestion) {
            offset += 1;
          }
          return;
        }
        if ((e.key === 'ArrowUp' || e.code === 'ArrowUp') && $input) {
          e.preventDefault();
          if ($isInputFocused && 'id' in suggestion) {
            offset -= 1;
          }
          return;
        }
      }}
      use:shortcut={{ control: true, code: 'KeyK', callback: ({ node }) => node.focus() }}
      use:shortcut={{ code: 'Escape', callback: () => onDismiss() }}
      {placeholder}
    />
  </div>

  {#if !$isInputFocused && !$input}
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
