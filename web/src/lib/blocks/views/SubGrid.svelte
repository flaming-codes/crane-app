<script lang="ts">
  import clsx from 'clsx';

  export let cn: string | undefined = undefined;
  export let size: '4' | '2' | '1' | undefined = undefined;
  export { cn as class };

  const sizeFour = `
      grid grid-cols-2 gap-4
      sm:grid-col-3
      md:grid-cols-2 md:gap-8
      lg:grid-cols-3 lg:gap-x-12 lg:gap-y-8
      xl:grid-cols-4 
    `;

  const sizeTwo = `
      grid grid-cols-1 gap-4
      sm:grid-col-2
      md:grid-cols-1 md:gap-8
      lg:grid-cols-2 lg:gap-x-12 lg:gap-y-8
      xl:grid-cols-2 
    `;
</script>

<table class="w-full">
  <tbody
    class={clsx(
      {
        [sizeFour]: !size || size === '4',
        [sizeTwo]: size === '2',
        'grid grid-cols-1 gap-4': size === '1'
      },
      cn
    )}
  >
    <slot />
  </tbody>
</table>
