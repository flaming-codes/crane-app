<script lang="ts">
  import Link from '$lib/display/views/Link.svelte';
  import clsx from 'clsx';

  export let href: string;
  export let title: string;
  export let ariaLabel: string | undefined = undefined;
  export let withGap: boolean | undefined = undefined;
</script>

<Link
  {href}
  {title}
  ariaLabel={ariaLabel || title}
  class={clsx('flex items-center h-full hover:animate-pulse', {
    'pl-3 pr-3 first:pl-0 last:pr-0': withGap
  })}
>
  <slot />
</Link>
