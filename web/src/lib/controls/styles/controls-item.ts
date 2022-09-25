import clsx from 'clsx';

export function getControlsItemStyle(params: { withGap?: boolean }) {
  const { withGap } = params;

  return clsx('flex items-center h-full hover:animate-pulse', {
    'pl-3 pr-3 first:pl-0 last:pr-0': withGap
  });
}
