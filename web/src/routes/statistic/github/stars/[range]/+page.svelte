<script lang="ts">
  import Hero from '$lib/blocks/views/Hero.svelte';
  import Iconic from '$lib/blocks/views/Iconic.svelte';
  import Section from '$lib/blocks/views/Section.svelte';
  import SheetContent from '$lib/blocks/views/SheetContent.svelte';
  import SubGrid from '$lib/blocks/views/SubGrid.svelte';
  import SubGridIcon from '$lib/blocks/views/SubGridIcon.svelte';
  import SubGridItem from '$lib/blocks/views/SubGridItem.svelte';
  import CommonControls from '$lib/controls/views/CommonControls.svelte';
  import ColorScheme from '$lib/display/views/ColorScheme.svelte';
  import Link from '$lib/display/views/Link.svelte';
  import NotificationCenterAnchor from '$lib/notification/view/NotificationCenterAnchor.svelte';
  import BasePageInit from '$lib/page/views/BasePageInit.svelte';
  import BaseMeta from '$lib/seo/views/BaseMeta.svelte';
  import BreadcrumbMeta from '$lib/seo/views/BreadcrumbMeta.svelte';
  import { mapRangeToLabel } from '$lib/statistics/models/github';
  import clsx from 'clsx';
  import type { PageServerData } from './$types';

  export let data: PageServerData;
  const { items, ranges } = data;

  let selectedRange = data.selectedRange;
</script>

<BasePageInit withBaseMeta={false} withBreadcrumb={false} />
<BaseMeta
  title={`Trending R packages by Github stars`}
  description={`Trending R packages by Github stars for the last ${mapRangeToLabel(selectedRange)}`}
  path="/statistic/github/stars/{selectedRange}"
  image={{
    url: `https://www.cran-e.com/api/statistic/github/stars/${selectedRange}/poster.jpeg`,
    alt: `Poster for range ${selectedRange}`
  }}
/>
<BreadcrumbMeta
  items={[
    { name: 'Statistics', href: '/statistic' },
    { name: 'Github statistic', href: '/github/statistic' },
    { name: 'Trending R packages by Github stars', href: '/statistic/github/stars' },
    {
      name: `Trending R packages by Github stars for the last ${mapRangeToLabel(selectedRange)}`,
      href: `/statistic/github/stars/${selectedRange}`
    }
  ]}
/>
<CommonControls variant="translucent" />
<ColorScheme scheme="dark" />
<NotificationCenterAnchor />

<main>
  <Hero
    isFixed
    title="Trends on Github"
    titleSize="lg"
    subtitle="Packages by most stars"
    subtitleSize="xl"
    height="50"
    variant="prominent"
    theme="gradient-dark-zinc"
  />

  <SheetContent offset="50" class=" text-neutral-50 space-y-20 lg:space-y-52 pb-60 bg-zinc-900">
    <Section withSpacingY="md" withPaddingX maxWidth="xl" class="mx-auto">
      <div class="text-lg flex items-center justify-center gap-x-2">
        Trends for last
        <select
          bind:value={selectedRange}
          class="appearance-none bg-black/0 overflow-hidden border border-neutral-500 px-2 rounded cursor-pointer"
          on:change={(ev) => {
            const { value } = ev.currentTarget;
            window.location.href = `/statistic/github/stars/${value}`;
          }}
        >
          {#each ranges as range}
            <option value={range}>{mapRangeToLabel(range)}</option>
          {/each}
        </select>
      </div>

      {#if items.length === 0}
        <div class="text-center space-y-2 pt-10">
          <h3 class="text-xl">No trends yet available</h3>
          <p class="text-lg text-neutral-300">
            Please try again later. If you think this is a bug, please report it at <a
              href="https://www.github.com/flaming-codes/crane-app"
              class="underline">our repo</a
            >.
          </p>
        </div>
      {/if}

      <SubGrid size="1" class="gap-8">
        {#each items as { original, trend, crane }}
          <SubGridItem withBorder withSpaceY="md" withValueSpaceY="xs" key="" emphasis="key">
            <Link
              slot="key"
              title={original.name}
              href={crane.packageSlug ? `/package/${crane.packageSlug}` : original.html_url}
              >{original.name}
            </Link>
            <p class="flex items-center space-x-2">
              <span class="text-sm"
                >by
                <Link
                  href="https://github.com/{original.owner.login}"
                  target="_external"
                  rel="noopener"
                >
                  {original.owner.login}
                </Link>
              </span>
              <img
                src={original.owner.avatar_url}
                alt="Github avatar for {original.name}"
                loading="lazy"
                class="w-5 h-5 object-cover rounded-full overflow-hidden"
                width="20"
                height="20"
              />
            </p>

            <p>{original.description}</p>

            <p
              class={clsx('flex items-center space-x-1', {
                'text-green-500': trend.stargazers_count,
                'text-red-500': trend.stargazers_count < 0,
                'opacity-50': !trend.stargazers_count
              })}
            >
              {#if trend.stargazers_count}
                <span>
                  {trend.stargazers_count > 0 ? '+' : ''}
                  {trend.stargazers_count}
                </span>
                <Iconic name="carbon:star-filled" class="w-4 h-4" />
              {:else}
                <span>(no change)</span>
              {/if}
              <span class="flex items-center space-x-1 text-neutral-300">
                <span>/</span>
                <span>{original.stargazers_count}</span>
                <Iconic name="carbon:star-filled" class="w-4 h-4" />
              </span>
            </p>

            <div class="flex items-center space-x-3 pt-2 text-neutral-200">
              {#if crane.packageSlug}
                <Link
                  href="/package/{crane.packageSlug}"
                  class="rounded border border-neutral-500 px-2 py-1 text-xs"
                >
                  Available on <strong>CRAN/E</strong>
                </Link>
              {/if}
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
