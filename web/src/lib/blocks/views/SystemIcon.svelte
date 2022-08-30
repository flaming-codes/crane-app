<script lang="ts">
  import Icon from '@iconify/svelte';
  import clsx from 'clsx';

  export let icon: 'windows' | 'macos' | 'old';
  export let width: string | undefined = undefined;
  export let height: string | undefined = undefined;

  let cn: string | undefined = undefined;
  export { cn as class };
</script>

<Icon
  {width}
  {height}
  icon={clsx({
    'cib:windows': icon === 'windows',
    'file-icons:finder': icon === 'macos',
    'carbon:server-time': icon === 'old'
  })}
  class={clsx('text-4xl text-neutral-400', cn)}
/>
