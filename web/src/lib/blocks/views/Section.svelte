<script lang="ts">
  import clsx from 'clsx';

  export let id: string | undefined = undefined;
  export let withPaddingX = true;
  export let withBorder: boolean | undefined = undefined;
  export let withPaddingBottom: boolean | undefined = undefined;
  export let withSpacingY: 'xs' | 'sm' | 'md' | boolean | undefined = undefined;
  export let withTwoFoldLayout: boolean | undefined = undefined;
  export let maxWidth: 'xl' | undefined = undefined;

  let cn: string | undefined = undefined;
  export { cn as class };
</script>

<section
  id={id ? encodeURIComponent(id) : ''}
  class={clsx(
    'scroll-mt-10',
    {
      'px-3 md:px-20': withPaddingX,
      'pb-10 md:pb-18': withPaddingBottom,
      'space-y-4 lg:space-y-6': withSpacingY === 'xs',
      'space-y-6 lg:space-y-6': withSpacingY === 'sm',
      'space-y-10 lg:space-y-14': withSpacingY === 'md',
      'border-t first:border-none border-neutral-400': withBorder,
      'flex flex-col lg:flex-row isolate': withTwoFoldLayout,
      'max-w-4xl': maxWidth === 'xl'
    },
    cn
  )}
>
  <slot />
</section>
