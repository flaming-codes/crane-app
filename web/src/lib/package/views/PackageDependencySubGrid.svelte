<script lang="ts">
  import type { Dependency } from '../type';
  import Iconic from '$lib/blocks/views/Iconic.svelte';
  import SubGridItem from '$lib/blocks/views/SubGridItem.svelte';
  import Link from '$lib/display/views/Link.svelte';
  import SubGrid from '$lib/blocks/views/SubGrid.svelte';

  export let items: Dependency[];
  export let emphasis: 'key' | undefined = undefined;
</script>

<SubGrid>
  {#each items as { name, link, version }}
    <SubGridItem
      withKeyTruncate
      key={name}
      withSpaceY={link || version ? 'xs' : undefined}
      {emphasis}
    >
      {#if version}
        <span>{version}</span>
      {/if}
      {#if link}
        <Link href={link} rel="noopener noreferrer" target="_blank" class="block">
          <Iconic name="carbon:arrow-up-right" />
        </Link>
      {/if}
    </SubGridItem>
  {/each}
</SubGrid>
