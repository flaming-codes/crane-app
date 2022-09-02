<script lang="ts">
  import clsx from 'clsx';

  export let key: string;

  export let withBorder = true;
  export let emphasis: 'key' | 'value' = 'value';
  export let title: string | undefined = undefined;
  export let withSpaceY: 'xs' | 'md' | undefined = undefined;
  export let withValueSpaceY: 'xs' | 'md' | undefined = undefined;
  export let withKeyTruncate: boolean = false;
  export let url: string | false | undefined = undefined;
</script>

<tr
  {title}
  on:click={() => {
    if (url) {
      window.open(url, '_blank');
    }
  }}
  class={clsx('flex flex-col items-start h-max', {
    'border-l border-neutral-500 pl-2': withBorder,
    'space-y-1': withSpaceY === 'xs',
    'space-y-2': withSpaceY === 'md',
    'cursor-pointer': url
  })}
>
  <td
    class={clsx('font-mono', {
      'text-xs text-neutral-400': emphasis === 'value',
      'truncate max-w-[99%]': withKeyTruncate
    })}
    >{key}
    <slot name="key" />
  </td>
  <td
    class={clsx('text-lg', {
      'text-xs text-neutral-400': emphasis === 'key',
      'space-y-1': withValueSpaceY === 'xs',
      'space-y-2': withValueSpaceY === 'md'
    })}
    ><slot />
  </td>
</tr>
