<script lang="ts">
  import clsx from 'clsx';

  export let title: string;
  export let subtitle: string | undefined = undefined;
  export let height: '30' | '50' | '70' | 'full';
  export let isFixed: boolean | undefined = undefined;
  export let theme: 'dark' | undefined = undefined;
</script>

<section
  class={clsx(
    `
    px-2 top-0 w-full -z-10 flex flex-col justify-center space-y-4 items-center
    sm:px-10
    md:flex-row md:space-x-6 md:space-y-0 md:justify-start
    lg:px-20
    `,
    {
      'h-[clamp(40vh,50vw,70vh)]': height === '70',
      'h-[clamp(40vh,40vw,50vh)]': height === '50',
      'h-[clamp(10vh,20vw,30vh)]': height === '30',
      'h-screen': height === 'full',
      fixed: isFixed,
      'bg-black text-white': theme === 'dark'
    }
  )}
>
  <h1 class="text-[clamp(2.8rem,9vw,9rem)] font-bold">{title}</h1>
  <h2 class="text-sm lg:text-lg opacity-60 text-center">
    {subtitle}
  </h2>

  <slot />
</section>
