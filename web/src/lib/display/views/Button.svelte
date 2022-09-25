<script lang="ts">
  import clsx from 'clsx';

  export let variant: 'neutral' | 'highlight' = 'neutral';
  export let readonly: boolean | undefined = undefined;
  export let type: 'reset' | 'submit' | 'button' | undefined = undefined;
  export let size: 'sm' | 'md' = 'md';
  export let font: 'mono' | 'sans' = 'mono';
  export let withSpaceX: 'sm' | 'md' | undefined = 'sm';
  export let withFlex = true;
  export let title: string | undefined = undefined;
  export let ariaLabel: string | undefined = undefined;

  let cn: string | undefined = undefined;
  export { cn as class };
</script>

<button
  {readonly}
  {type}
  {title}
  aria-label={ariaLabel}
  class={clsx(
    'text-sm border rounded transition-colors duration-150 ease-in-out',
    {
      'bg-neutral-800 text-neutral-200 border-neutral-600 hover:border-neutral-700 hover:bg-neutral-700':
        variant === 'neutral',
      'bg-neutral-600 text-neutral-100 border-neutral-500 hover:border-neutral-700 hover:bg-neutral-700':
        variant === 'highlight',
      'p-2 px-4 ': size === 'md',
      'p-1 px-3 text-xs': size === 'sm',
      'font-mono': font === 'mono',
      'space-x-2': withSpaceX === 'sm',
      'space-x-4': withSpaceX === 'md',
      'flex items-center': withFlex
    },
    cn
  )}
  on:click
>
  <slot />
  <slot name="icon" />
</button>
