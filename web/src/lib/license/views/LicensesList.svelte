<script lang="ts">
  import Link from '$lib/display/views/Link.svelte';
  import type { ExportedLicense } from '../types';

  export let licenses: ExportedLicense[];
</script>

<ul>
  {#each licenses as l}
    <li>
      <Link
        href={l.link.replace('git+', '').replace('.git', '')}
        ariaLabel={`License for ${l.name}`}
        rel="noopener"
        target="_blank"
      >
        <div class="hover:text-neutral-400 duration-200 ease-in-out py-3 space-x-2">
          <span>
            {l.name}
          </span>
          <span class="opacity-70">by</span>
          <span>
            {l.author}
          </span>
        </div>
      </Link>
    </li>
  {/each}
</ul>
