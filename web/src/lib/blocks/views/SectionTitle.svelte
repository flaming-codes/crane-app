<script lang="ts">
  import clsx from 'clsx';

  let cn: string | undefined = undefined;
  export { cn as class };
</script>

<div
  class={clsx(
    `
    py-3 px-4 bg-zinc-300/80 backdrop-blur-sm sticky -top-1 overflow-hidden text-center
    lg:px-20 lg:py-10
    `,
    cn
  )}
>
  <h2 class="text-xl xl:text-3xl font-bold"><slot /></h2>
</div>
