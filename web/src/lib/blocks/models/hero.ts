import clsx from 'clsx';

export type HeroGradientTheme =
  | 'light'
  | 'muted'
  | 'dark'
  | 'gradient-slate'
  | 'gradient-dark'
  | 'gradient-black-slate'
  | 'gradient-stone'
  | 'gradient-dark-zinc';

export function getHeroGradient(theme?: HeroGradientTheme) {
  return clsx({
    'bg-zinc-100 text-black': theme === 'light',
    'bg-gray-300 text-black': theme === 'muted',
    'bg-black text-white': theme === 'dark',
    'from-zinc-200 to-slate-500 bg-gradient-to-b text-black': theme === 'gradient-slate',
    'from-neutral-100 to-stone-400 bg-gradient-to-b text-black': theme === 'gradient-stone',
    'from-zinc-900 to-slate-500 bg-gradient-to-b text-neutral-200': theme === 'gradient-dark',
    'from-black to-slate-500 bg-gradient-to-b text-neutral-200': theme === 'gradient-black-slate',
    'from-zinc-700 to-zinc-900 bg-gradient-to-b text-neutral-200': theme === 'gradient-dark-zinc'
  });
}

export function checkForSingleLongTitle(title: string) {
  // Edge case: a single long title w/o breaks,
  // which would otherwise overflow the container.
  // Note that on mobile, this won't fix the issue.
  // as we don't have enough space to fit the title.
  return title.length > 16 && title.split(' ').length === 1;
}
