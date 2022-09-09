<script lang="ts">
  import clsx from 'clsx';

  export let href: string;
  export let ariaLabel: string | undefined = undefined;
  export let title: string | undefined = undefined;
  export let target: string | undefined = undefined;
  export let rel: 'noopener noreferrer' | undefined = undefined;
  export let withForcedReload: true | undefined = undefined;

  let cn: string | undefined = undefined;
  export { cn as class };
</script>

<a
  {href}
  {target}
  {rel}
  {title}
  aria-label={ariaLabel}
  class={clsx('hover:animate-pulse', cn)}
  sveltekit:reload={withForcedReload}
>
  <slot />
</a>
