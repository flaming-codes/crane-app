<script lang="ts">
  import clsx from 'clsx';

  export let readonly: boolean | undefined = undefined;
  export let type: string = 'text';
  export let size: 'sm' | 'md' = 'md';
  export let font: 'mono' | 'sans' = 'mono';
  export let withSpaceX: 'sm' | 'md' | undefined = 'sm';
  export let withFlex = true;
  export let title: string | undefined = undefined;

  let cn: string | undefined = undefined;
  export { cn as class };
</script>

<button
  {readonly}
  {type}
  {title}
  class={clsx(
    'bg-neutral-800 text-neutral-200 text-sm border border-neutral-600 rounded transition-colors duration-150 ease-in-out',
    'hover:border-neutral-700 hover:bg-neutral-700',
    {
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
