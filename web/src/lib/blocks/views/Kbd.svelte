<script lang="ts">
  import { browser } from '$app/environment';

  import { platformString } from '$lib/pwa/model/text';
  import clsx from 'clsx';

  export let theme: 'light' | 'dark' = 'light';
  export let inline: boolean | undefined = undefined;
  export let withLowOpacity: boolean | undefined = true;
  export let text: string;

  let cn: string | undefined = undefined;
  export { cn as class };

  $: content = browser ? platformString(text) : text;
</script>

<kbd
  class={clsx(
    `
     py-[2px] px-2 rounded font-bold text-xs tracking-tigher
    border
    `,
    {
      'mx-2': inline,
      'border-gray-500 ': theme === 'light',
      'border-gray-200 text-gray-200': theme === 'dark',
      'opacity-70': withLowOpacity
    },
    cn
  )}>{content}</kbd
>
