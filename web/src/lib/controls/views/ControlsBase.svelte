<script lang="ts">
  import clsx from 'clsx';

  export let variant:
    | 'light'
    | 'dark'
    | 'void'
    | 'black'
    | 'translucent'
    | 'transparent'
    | undefined = undefined;
  let cn: string | undefined = undefined;
  export { cn as class };
</script>

<aside
  class={clsx(
    `
    fixed top-0 left-0 right-0 h-nav flex px-6 z-10 transition-colors duration-150 ease-in-out
    md:px-12
    lg:px-20
  `,
    {
      'bg-zinc-300/60 backdrop-blur-lg text-zinc-800': !variant || variant === 'light',
      'bg-zinc-400/[0.1] backdrop-blur-lg text-gray-200': variant === 'dark',
      'bg-zinc-600/[0.1] backdrop-blur-lg text-gray-200': variant === 'void',
      'bg-black/80 backdrop-blur-lg text-white': variant === 'black',
      'bg-transparent backdrop-blur-lg': variant === 'translucent',
      'bg-transparent': variant === 'transparent'
    },
    cn
  )}
>
  <slot />
</aside>
