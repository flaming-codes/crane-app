<script lang="ts">
  import clsx from 'clsx';

  export let key: string;

  export let withBorder = true;
  export let emphasis: 'key' | 'value' = 'value';
  export let title: string | undefined = undefined;
  export let withSpaceY: 'xs' | 'md' | undefined = undefined;
  export let withValueSpaceY: 'xs' | 'md' | undefined = undefined;
  export let withValueOverflow: 'hidden' | undefined = undefined;
  export let withKeyTruncate: boolean = false;
  export let url: string | false | undefined = undefined;
  export let urlTarget: '_blank' | '_self' | '_parent' | '_top' | undefined = undefined;
  export let onClick: ((event: MouseEvent) => void) | undefined = undefined;

  let cn: string | undefined = undefined;
  export { cn as class };
</script>

<tr
  {title}
  on:click={(event) => {
    if (onClick || url) {
      event.stopPropagation();
      if (onClick) {
        onClick(event);
      }
      if (url) {
        if (urlTarget) {
          window.open(url, urlTarget);
        } else {
          window.location.href = url;
        }
      }
    }
  }}
  class={clsx(
    'flex flex-col items-start h-max',
    {
      'border-l border-neutral-500 pl-2': withBorder,
      'space-y-1': withSpaceY === 'xs',
      'space-y-2': withSpaceY === 'md',
      'cursor-pointer': url || onClick
    },
    cn
  )}
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
    class={clsx('w-full text-lg', {
      'text-xs text-neutral-400': emphasis === 'key',
      'space-y-1': withValueSpaceY === 'xs',
      'space-y-2': withValueSpaceY === 'md',
      'overflow-x-hidden overflow-y-auto': withValueOverflow === 'hidden'
    })}
    ><slot />
  </td>
</tr>
