<script lang="ts">
  import Hero from '$lib/blocks/views/Hero.svelte';
  import Section from '$lib/blocks/views/Section.svelte';
  import SheetContent from '$lib/blocks/views/SheetContent.svelte';
  import SubGrid from '$lib/blocks/views/SubGrid.svelte';
  import SubGridIcon from '$lib/blocks/views/SubGridIcon.svelte';
  import SubGridItem from '$lib/blocks/views/SubGridItem.svelte';
  import CommonControls from '$lib/controls/views/CommonControls.svelte';
  import BasePageInit from '$lib/page/views/BasePageInit.svelte';
  import type { PageServerData } from './$types';

  export let data: PageServerData;
  const { items } = data;
</script>

<BasePageInit title="Packages by Github stars" path="/statistics/github/stars" />
<CommonControls variant="translucent" />

<main>
  <Hero
    isFixed
    title="Trends on Github"
    titleSize="lg"
    subtitle="Packages by most stars"
    subtitleSize="xl"
    height="50"
    variant="prominent"
  />

  <SheetContent offset="50" class=" text-neutral-50 space-y-20 pb-60 bg-zinc-900">
    <Section withSpacingY withPaddingX class="mx-auto max-w-7xl space-y-10">
      <SubGrid size="1">
        {#each items as { original }}
          <SubGridItem withBorder withSpaceY="md" key={original.name} emphasis="key">
            <img
              src={'https://loremflickr.com/640/480/abstract'}
              alt="Github avatar for {original.name}"
              loading="lazy"
              class="w-12 h-12 object-cover rounded-full overflow-hidden"
              width="48"
              height="48"
            />
          </SubGridItem>
        {/each}
      </SubGrid>
    </Section>
  </SheetContent>
</main>
