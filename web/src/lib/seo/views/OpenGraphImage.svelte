<script lang="ts">
  import {
    checkForSingleLongTitle,
    getHeroGradient,
    type HeroGradientTheme
  } from '$lib/blocks/models/hero';
  import clsx from 'clsx';

  export let title: string;
  export let titleSize: 'md' | 'lg' | 'xl' = 'xl';
  export let subtitleSize: 'lg' | 'xl' = 'xl';
  export let subtitle: string | undefined = undefined;
  export let theme: HeroGradientTheme | undefined = undefined;
  export let textVariant: 'dense' | 'fit' | undefined = undefined;

  const isSingleLongTitle = checkForSingleLongTitle(title);
</script>

<section
  class={clsx(
    `top-0 w-full h-screen flex flex-col justify-center items-center space-y-16 pt-nav text-center px-[5vw]`,
    getHeroGradient(theme)
  )}
>
  <h1
    class={clsx('font-bold', {
      'text-[clamp(2.4rem,7vw,4rem)]': titleSize === 'md' && !isSingleLongTitle,
      'text-[clamp(2rem,8vw,2.8rem)]': titleSize === 'md' && isSingleLongTitle,
      'text-[clamp(2.8rem,8vw,7rem)]': titleSize === 'lg' && !isSingleLongTitle,
      'text-[clamp(2.8rem,8vw,5rem)]': titleSize === 'lg' && isSingleLongTitle,
      'text-[clamp(2.8rem,9vw,9rem)]': titleSize === 'xl' && !isSingleLongTitle,
      'text-[clamp(2.8rem,7vw,6rem)]': titleSize === 'xl' && isSingleLongTitle,
      'break-all leading-none': textVariant === 'dense',
      'break-words leading-none': textVariant === 'fit'
    })}
  >
    {title}
  </h1>
  <div
    class={clsx('text-base opacity-70 text-center leading-6 lg:leading-10', {
      'text-[clamp(0.8rem,8vw,1.8rem)]': subtitleSize === 'lg',
      'text-[clamp(1rem,3vw,2rem)]': subtitleSize === 'xl'
    })}
  >
    {#if subtitle}
      <h2>{subtitle}</h2>
    {/if}
    <slot name="subtitle" />
  </div>

  <slot />
</section>
