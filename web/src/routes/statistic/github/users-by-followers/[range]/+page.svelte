<script lang="ts">
  import Hero from '$lib/blocks/views/Hero.svelte';
  import Iconic from '$lib/blocks/views/Iconic.svelte';
  import Section from '$lib/blocks/views/Section.svelte';
  import SheetContent from '$lib/blocks/views/SheetContent.svelte';
  import SubGrid from '$lib/blocks/views/SubGrid.svelte';
  import SubGridItem from '$lib/blocks/views/SubGridItem.svelte';
  import CommonControls from '$lib/controls/views/CommonControls.svelte';
  import ColorScheme from '$lib/display/views/ColorScheme.svelte';
  import Link from '$lib/display/views/Link.svelte';
  import NotificationCenterAnchor from '$lib/notification/view/NotificationCenterAnchor.svelte';
  import BasePageInit from '$lib/page/views/BasePageInit.svelte';
  import BaseMeta from '$lib/seo/views/BaseMeta.svelte';
  import BreadcrumbMeta from '$lib/seo/views/BreadcrumbMeta.svelte';
  import { mapRangeToLabel } from '$lib/statistics/models/github';
  import GithubRangeSelect from '$lib/statistics/views/GithubRangeSelect.svelte';
  import clsx from 'clsx';
  import type { PageServerData } from './$types';

  export let data: PageServerData;
  const { items, ranges } = data;

  let selectedRange = data.selectedRange;
</script>

<BasePageInit withBaseMeta={false} withBreadcrumb={false} />
<BaseMeta
  title={`Trending R coders on Github by followers`}
  description={`Trending R coders on Github by followers for the last ${mapRangeToLabel(
    selectedRange
  )}`}
  path="/statistic/github/users-by-followers/{selectedRange}"
  image={{
    url: `https://www.cran-e.com/api/statistic/github/users-by-followers/${selectedRange}/poster.jpeg`,
    alt: `Poster for range ${selectedRange}`
  }}
/>
<BreadcrumbMeta
  items={[
    { name: 'Statistics', href: '/statistic' },
    { name: 'Github statistic', href: '/github/statistic' },
    {
      name: 'Trending R coders on Github by followers',
      href: '/statistic/github/users-by-followers'
    },
    {
      name: `Trending R coders on Github by followers for the last ${mapRangeToLabel(
        selectedRange
      )}`,
      href: `/statistic/github/users-by-followers/${selectedRange}`
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
    subtitle="Popular R-coders by followers"
    subtitleSize="xl"
    height="50"
    variant="prominent"
    theme="gradient-dark-zinc"
  />

  <SheetContent
    offset="50"
    class="relative text-neutral-50 space-y-20 lg:space-y-52 pb-60 bg-zinc-900"
  >
    <GithubRangeSelect
      {ranges}
      {selectedRange}
      composeHref={(value) => `/statistic/github/users-by-followers/${value}`}
    />

    <Section withSpacingY="md" withPaddingX maxWidth="xl" class="mx-auto">
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
        {#each items as { original, trend }}
          <SubGridItem withBorder withSpaceY="md" withValueSpaceY="xs" key="" emphasis="key">
            <Link
              slot="key"
              title={original.name}
              href={original.html_url}
              class="flex items-center space-x-2"
            >
              <img
                src={original.avatar_url}
                alt="Avatar for {original.name}"
                class="w-8 h-8 rounded-full overflow-hidden object-cover bg-zinc-800"
                loading="lazy"
              />
              <span>{original.name}</span>
            </Link>
            {#if original.bio}
              <p>
                {original.bio}
              </p>
            {/if}
            <p
              class={clsx('flex items-center space-x-1', {
                'text-green-500': trend.followers,
                'text-red-500': trend.followers < 0,
                'opacity-50': !trend.followers
              })}
            >
              {#if trend.followers}
                <span>
                  {trend.followers > 0 ? '+' : ''}
                  {trend.followers}
                </span>
                <Iconic name="carbon:group" class="w-4 h-4" />
              {:else}
                <span>(no change)</span>
              {/if}
              <span class="flex items-center space-x-1 text-neutral-300">
                <span>/</span>
                <span>{original.followers}</span>
                <Iconic name="carbon:group" class="w-4 h-4" />
              </span>
            </p>

            <div class="flex items-center space-x-3 pt-2 text-neutral-200">
              {#if original.public_repos}
                <Link
                  target="_blank"
                  rel="noopener"
                  href="{original.html_url}?tab=repositories"
                  class="rounded border border-neutral-500 px-2 py-1 text-xs"
                >
                  {original.public_repos} public {original.public_repos === 1 ? 'repo' : 'repos'}
                  <Iconic name="carbon:repo-source-code" class="inline w-4 h-4 ml-1" />
                </Link>
              {/if}
              {#if original.following}
                <Link
                  target="_blank"
                  rel="noopener"
                  href="{original.html_url}?tab=following"
                  class="rounded border border-neutral-500 px-2 py-1 text-xs"
                >
                  Following {original.following}
                  {original.following === 1 ? 'user' : 'users'}
                  <Iconic name="carbon:user-favorite" class="inline w-4 h-4 ml-1" />
                </Link>
              {/if}
            </div>
          </SubGridItem>
        {/each}
      </SubGrid>
    </Section>
  </SheetContent>
</main>
