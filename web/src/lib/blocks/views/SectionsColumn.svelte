<script lang="ts">
  import clsx from 'clsx';

  export let spaceY: 'md' | 'lg' | undefined = 'md';
</script>

<div
  class={clsx('flex-1 pb-20', {
    'space-y-10 md:space-y-12': spaceY === 'md',
    'space-y-16 md:space-y-20': spaceY === 'lg'
  })}
>
  <slot />
</div>
