<script lang="ts">
  import clsx from 'clsx';

  export let spaceY: 'md' | 'lg' | undefined = 'md';
</script>

<div
  class={clsx('flex-1 pb-20', {
    'space-y-10': spaceY === 'md',
    'space-y-14': spaceY === 'lg'
  })}
>
  <slot />
</div>
