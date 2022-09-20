<script lang="ts">
  import clsx from 'clsx';

  export let theme: 'light' | 'dark' = 'light';
  let cn: string | undefined = undefined;
  export { cn as class };
</script>

<div
  class={clsx(
    `
    flex flex-col justify-between h-28 px-4 py-1
    border border-transparent transition-colors duration-150 ease-in-out
    `,
    {
      'hover:border-l-neutral-700': theme === 'light',
      'hover:border-l-neutral-200': theme === 'dark'
    },
    cn
  )}
>
  <slot />
</div>
