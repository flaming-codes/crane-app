<!--
    Complement to the 'Hero' if the hero is fixed.
    This allows the content of this content to slide over
    the hero on scroll by applying an initial margin-top.
    and bg-color.
-->
<script lang="ts">
  import clsx from 'clsx';

  export let offset: '50';

  let cn: string | undefined = undefined;
  export { cn as class };
</script>

<div
  class={clsx(
    {
      'mt-[clamp(40vh,40vw,50vh)]': offset === '50'
    },
    cn
  )}
>
  <slot />
</div>
