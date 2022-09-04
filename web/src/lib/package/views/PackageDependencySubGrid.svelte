<script lang="ts">
  import type { Dependency } from '../type';
  import Iconic from '$lib/blocks/views/Iconic.svelte';
  import SubGridItem from '$lib/blocks/views/SubGridItem.svelte';
  import Link from '$lib/display/views/Link.svelte';
  import SubGrid from '$lib/blocks/views/SubGrid.svelte';

  export let items: Dependency[];
  export let emphasis: 'key' | undefined = undefined;

  let visibleThreshold = 50;
  $: visibleItems = visibleThreshold !== Infinity ? items.slice(0, visibleThreshold) : items;

  const onClick = () => (visibleThreshold = Infinity);
</script>

<SubGrid>
  {#each visibleItems as { name, link, version }}
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

  {#if visibleThreshold !== Infinity && items.length > visibleThreshold}
    <SubGridItem
      key="Load all {items.length} items"
      emphasis="key"
      withValueSpaceY="xs"
      class="col-span-full group hover:animate-pulse"
      {onClick}
    >
      <div class="text-neutral-300">
        (warning: might lead to performance issues and take some seconds)
      </div>
      <Iconic name="carbon:expand-categories" />
    </SubGridItem>
  {/if}
</SubGrid>
