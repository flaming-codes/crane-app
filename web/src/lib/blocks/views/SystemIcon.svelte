<script lang="ts">
  import clsx from 'clsx';
  import Iconic from './Iconic.svelte';

  export let icon: 'windows' | 'macos' | 'old';
  export let size: '16' | '20' | '24' | '32' | '40' | '48' | '56';

  let cn: string | undefined = undefined;
  export { cn as class };
</script>

<Iconic
  {size}
  name={clsx({
    'cib:windows': icon === 'windows',
    'file-icons:finder': icon === 'macos',
    'carbon:server-time': icon === 'old'
  })}
  class={clsx('text-4xl text-neutral-400', cn)}
/>
