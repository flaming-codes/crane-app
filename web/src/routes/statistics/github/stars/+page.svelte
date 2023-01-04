<script lang="ts">
  import Hero from '$lib/blocks/views/Hero.svelte';
  import Iconic from '$lib/blocks/views/Iconic.svelte';
  import Section from '$lib/blocks/views/Section.svelte';
  import SheetContent from '$lib/blocks/views/SheetContent.svelte';
  import SubGrid from '$lib/blocks/views/SubGrid.svelte';
  import SubGridIcon from '$lib/blocks/views/SubGridIcon.svelte';
  import SubGridItem from '$lib/blocks/views/SubGridItem.svelte';
  import CommonControls from '$lib/controls/views/CommonControls.svelte';
  import Link from '$lib/display/views/Link.svelte';
  import BasePageInit from '$lib/page/views/BasePageInit.svelte';
  import clsx from 'clsx';
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

  <SheetContent offset="50" class=" text-neutral-50 space-y-20 lg:space-y-40 pb-60 bg-zinc-900">
    <Section withSpacingY withPaddingX maxWidth="xl" class="mx-auto">
      <SubGrid size="1" class="gap-8">
        {#each items as { original, trend }}
          <SubGridItem
            withBorder
            withSpaceY="md"
            withValueSpaceY="xs"
            key={original.name}
            emphasis="key"
          >
            <div class="flex items-center space-x-2">
              <span class="text-sm">by {original.owner.login}</span>
              <img
                src={'https://loremflickr.com/640/480/abstract'}
                alt="Github avatar for {original.name}"
                loading="lazy"
                class="w-5 h-5 object-cover rounded-full overflow-hidden"
                width="20"
                height="20"
              />
              <span
                class={clsx('flex items-center space-x-1', {
                  'text-green-700': trend.stargazers_count,
                  'opacity-50': !trend.stargazers_count
                })}
              >
                {#if trend.stargazers_count}
                  <span>
                    + {trend.stargazers_count}
                  </span>
                  <Iconic name="carbon:star-filled" />
                {:else}
                  <span>-</span>
                  <Iconic name="carbon:star-filled" />
                {/if}
              </span>
            </div>
            <p class="text-neutral-100">{original.description}</p>
            <div>
              <SubGridIcon
                meta={{
                  url: original.html_url,
                  icon: 'carbon:logo-github',
                  isExternal: true
                }}
              />
            </div>
          </SubGridItem>
        {/each}
      </SubGrid>
    </Section>
  </SheetContent>
</main>
