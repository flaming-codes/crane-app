<script lang="ts">
  import type { Pkg } from '../type';
  import Link from '$lib/display/views/Link.svelte';
  import clsx from 'clsx';

  export let item: Pick<Pkg, 'name' | 'slug' | 'title' | 'version'>;
  export let theme: 'light' | 'dark' = 'light';
</script>

<Link withForcedReload href="/package/{item.slug}" ariaLabel="Link to package {item.name}">
  <div
    class={clsx(
      `
      flex flex-col justify-between h-28 px-4 py-1
      dark:bg-transparent
      border border-transparent transition-colors duration-150 ease-in-out
    `,
      {
        'hover:border-l-neutral-700': theme === 'light',
        'hover:border-l-neutral-200': theme === 'dark'
      }
    )}
  >
    <div>
      <h3 class="text-lg font-bold truncate">{item.name}</h3>
      <p
        class={clsx('text-sm line-clamp-2 lg:w-4/5', {
          'text-neutral-600': theme === 'light',
          'text-neutral-300': theme === 'dark'
        })}
      >
        {item.title}
      </p>
    </div>
    <div
      class={clsx('font-mono text-xs', {
        'text-neutral-500': theme === 'light',
        'dark:text-gray-400': theme === 'dark'
      })}
    >
      {item.version}
    </div>
  </div>
</Link>
