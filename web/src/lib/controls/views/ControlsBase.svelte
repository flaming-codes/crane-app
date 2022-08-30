<script lang="ts">
  import clsx from 'clsx';

  export let variant: 'light' | 'dark' | 'black' | 'blue' | undefined = undefined;
  let cn: string | undefined = undefined;
  export { cn as class };
</script>

<aside
  class={clsx(
    {
      'fixed bottom-0 w-full h-[var(--base-controls-h)] px-3 z-10 pb-safe': true,
      'flex flex-col gap-x-6': true,
      'sm:flex-row sm:h-[var(--base-controls-h-sm)]': true,
      'md:px-12': true,
      'lg:px-20': true,
      'bg-zinc-300/60 backdrop-blur-lg': !variant || variant === 'light',
      'bg-zinc-400/[0.1] backdrop-blur-lg text-gray-200': variant === 'dark',
      'bg-black/80 backdrop-blur-sm text-white': variant === 'black',
      'bg-teal-600/60 backdrop-blur-sm text-black': variant === 'blue'
    },
    cn
  )}
>
  <slot />
</aside>
