<script lang="ts">
  import clsx from 'clsx';

  export let cn: string | undefined = undefined;
  export { cn as class };
</script>

<table class="w-full">
  <tbody
    class={clsx(
      `
      grid grid-cols-2 gap-4
      sm:grid-col-3
      md:grid-cols-2 md:gap-8
      lg:grid-cols-3 lg:gap-x-12 lg:gap-y-8
      xl:grid-cols-4 
    `,
      cn
    )}
  >
    <slot />
  </tbody>
</table>
