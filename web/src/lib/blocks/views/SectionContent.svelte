<script lang="ts">
  import clsx from 'clsx';

  export let withPaddingX: 'xs' | 'sm' | boolean | undefined = 'sm';
  export let withPaddingLeft: boolean | undefined = undefined;
  export let withSpacingY: boolean | undefined = true;
  export let withPaddingBottom: boolean | undefined = undefined;
  export let withProse: 'light' | 'dark' | undefined = undefined;

  let cn: string | undefined = undefined;
  export { cn as class };
</script>

<div
  class={clsx(
    {
      'px-3 md:px-12': withPaddingX === 'xs',
      'px-3 md:px-20': withPaddingX === 'sm',
      'pb-10 md:pb-18': withPaddingBottom,
      'pl-3 md:pl-12 lg:pl-20': withPaddingLeft,
      'space-y-10 md:space-y-16 lg:space-y-20': withSpacingY,
      'prose max-w-none': withProse === 'light',
      'prose prose-invert max-w-none': withProse === 'dark'
    },
    cn
  )}
>
  <slot />
</div>
