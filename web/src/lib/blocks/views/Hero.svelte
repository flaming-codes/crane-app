<script lang="ts">
  import clsx from 'clsx';
  import { checkForSingleLongTitle, getHeroGradient, type HeroGradientTheme } from '../models/hero';

  export let title: string;
  export let titleSize: 'lg' | 'xl' = 'xl';
  export let subtitle: string | undefined = undefined;
  export let subtitleSize: 'lg' | 'xl' = 'lg';
  export let height: '30' | '40!' | '50' | '50!' | '70' | 'full' | 'screen' | 'flex';
  export let isFixed: boolean | undefined = undefined;
  export let theme: HeroGradientTheme | undefined = undefined;
  export let textVariant: 'dense' | 'fit' | undefined = undefined;
  export let variant: 'prominent' | undefined = undefined;

  let cn: string | undefined = undefined;
  export { cn as class };

  const isSingleLongTitle = checkForSingleLongTitle(title);

  const defaultVariant = `
  sm:px-10
    md:flex-row md:space-x-6 md:space-y-0 md:justify-start
    lg:px-20
  `;
</script>

<section
  class={clsx(
    ' top-0 w-full -z-10 flex flex-col justify-center space-y-4 items-center px-2 pt-nav',
    getHeroGradient(theme),
    {
      [defaultVariant]: !variant,
      'text-center px-[5vw]': variant === 'prominent',
      'h-[clamp(40vh,50vw,70vh)]': height === '70',
      'h-[clamp(40vh,40vw,50vh)]': height === '50',
      'h-[50vh]': height === '50!',
      'h-[40vh]': height === '40!',
      'h-[clamp(10vh,20vw,30vh)]': height === '30',
      'h-screen': height === 'screen',
      'h-full': height === 'full',
      'flex-1': height === 'flex',
      fixed: isFixed
    },
    cn
  )}
>
  <h1
    class={clsx('font-bold', {
      'text-[clamp(2.8rem,9vw,9rem)]': titleSize === 'xl' && !isSingleLongTitle,
      'text-[clamp(2.8rem,7vw,6rem)]': titleSize === 'xl' && isSingleLongTitle,
      'text-[clamp(2.8rem,8vw,7rem)]': titleSize === 'lg' && !isSingleLongTitle,
      'text-[clamp(2.8rem,8vw,5rem)]': titleSize === 'lg' && isSingleLongTitle,
      'break-all leading-none': textVariant === 'dense',
      'break-words leading-none': textVariant === 'fit'
    })}
  >
    {title}
  </h1>
  {#if subtitle}
    <h2
      class={clsx('text-base opacity-70 text-center', {
        'lg:text-lg xl:text-xl': subtitleSize === 'lg',
        'lg:text-xl xl:text-2xl': subtitleSize === 'xl'
      })}
    >
      {subtitle}
    </h2>
  {/if}

  <slot />
</section>
