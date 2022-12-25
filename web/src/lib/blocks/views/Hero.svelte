<script lang="ts">
  import clsx from 'clsx';

  export let title: string;
  export let titleSize: 'lg' | 'xl' = 'xl';
  export let subtitle: string | undefined = undefined;
  export let height: '30' | '40!' | '50' | '50!' | '70' | 'full' | 'screen' | 'flex';
  export let isFixed: boolean | undefined = undefined;
  export let theme:
    | 'light'
    | 'muted'
    | 'dark'
    | 'gradient-slate'
    | 'gradient-dark'
    | 'gradient-black-slate'
    | 'gradient-stone'
    | 'gradient-dark-zinc'
    | undefined = undefined;
  export let textVariant: 'dense' | 'fit' | undefined = undefined;
  export let variant: 'prominent' | undefined = undefined;

  // Edge case: a single long title w/o breaks,
  // which would otherwise overflow the container.
  // Note that on mobile, this won't fix the issue.
  // as we don't have enough space to fit the title.
  const isSingleLongTitle = title.length > 16 && title.split(' ').length === 1;

  const defaultVariant = `
  sm:px-10
    md:flex-row md:space-x-6 md:space-y-0 md:justify-start
    lg:px-20
  `;
</script>

<section
  class={clsx(
    ' top-0 w-full -z-10 flex flex-col justify-center space-y-4 items-center px-2 pt-nav',
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
      fixed: isFixed,
      'bg-zinc-100 text-black': theme === 'light',
      'bg-gray-300 text-black': theme === 'muted',
      'bg-black text-white': theme === 'dark',
      'from-zinc-200 to-slate-500 bg-gradient-to-b text-black': theme === 'gradient-slate',
      'from-neutral-100 to-stone-400 bg-gradient-to-b text-black': theme === 'gradient-stone',
      'from-zinc-900 to-slate-500 bg-gradient-to-b text-neutral-200': theme === 'gradient-dark',
      'from-black to-slate-500 bg-gradient-to-b text-neutral-200': theme === 'gradient-black-slate',
      'from-zinc-700 to-zinc-900 bg-gradient-to-b text-neutral-200': theme === 'gradient-dark-zinc'
    }
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
  <h2 class="text-base lg:text-lg xl:text-xl opacity-70 text-center">
    {subtitle}
  </h2>

  <slot />
</section>
