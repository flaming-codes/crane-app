<script lang="ts">
  import clsx from 'clsx';

  export let href: string;
  export let id: string | undefined = undefined;
  export let ariaLabel: string | undefined = undefined;
  export let title: string | undefined = undefined;
  export let target: string | undefined = undefined;
  export let rel: 'noopener' | undefined = undefined;
  export let withForcedReload: true | undefined = undefined;

  let cn: string | undefined = undefined;
  export { cn as class };
</script>

<a
  {href}
  {id}
  {target}
  {rel}
  {title}
  aria-label={ariaLabel}
  class={clsx('hover:animate-pulse', cn)}
  data-sveltekit-reload={withForcedReload ? '' : 'off'}
>
  <slot />
</a>
