<script lang="ts">
  import { store } from '../store/store';

  import { Transition } from '@rgossiaux/svelte-headlessui';
  import { onDestroy } from 'svelte';
  import clsx from 'clsx';
  import type { Intel } from '../types';
  import Kbd from '$lib/blocks/views/Kbd.svelte';

  const { queue } = store;

  let timer: NodeJS.Timeout | undefined;
  // Required to keep the content when the notifcation itself gets destroyed.
  // Else no content would be visible when the notification is transitioned away.
  let current: Intel;

  $: {
    if ($queue.length > 0 && !timer) {
      current = { ...$queue[0] };
      timer = setTimeout(() => {
        const [_, ...next] = $queue;
        timer = undefined;
        $queue = next;
      }, 3_000);
    }
  }

  onDestroy(() => {
    clearTimeout(timer);
  });
</script>

<Transition
  show={$queue.length > 0}
  class={clsx(
    'absolute inset-0 px-3 md:px-20 font-mono text-sm flex items-center bg-opacity-30 backdrop-blur-md text-white',
    {
      'bg-emerald-300': current?.type === 'success',
      'bg-sky-300': current?.type === 'info',
      'bg-red-400': current?.type === 'error',
      'border-t border-neutral-700': current?.type === 'neutral'
    }
  )}
  enter="duration-700"
  enterFrom="translate-y-full opacity-100 "
  enterTo="-translate-y-0 opacity-100"
  leave="duration-700"
  leaveFrom="-translate-y-full opacity-100"
  leaveTo="translate-y-full opacity-100 "
>
  {#if current.value}
    {#if current.value.includes('{{') && current.value.includes('}}')}
      {@const title = current.value.split(' ')[0]}
      {@const value = current.value.match(/\{\{(.*?)\}\}/)?.[1]}
      <span>{title}</span>
      <span
        class="ml-2 px-1 py-[1px] text-[0.6rem] rounded border border-neutral-200 border-opacity-50"
        >{value}</span
      >
    {:else}
      {current.value}
    {/if}
    {#if current.meta?.kbd}
      <Kbd text={current.meta.kbd.join(' ')} theme="dark" class="ml-4" />
    {/if}
  {/if}
</Transition>
