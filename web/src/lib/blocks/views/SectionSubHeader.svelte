<script lang="ts">
  import clsx from 'clsx';

  import SectionContent from './SectionContent.svelte';

  let cn: string | undefined = undefined;
  export { cn as class };
</script>

<header
  class={`
      sticky flex-1 flex items-center top-[calc(var(--base-controls-h-sm)*2)] bg-opacity-20 backdrop-blur-md
      lg:top-nav
    `}
>
  <SectionContent withPaddingX="xs">
    <h3 class={clsx('text-xl font-bold text-neutral-300 truncate h-14 flex items-center', cn)}>
      <slot />
    </h3>
  </SectionContent>
</header>
