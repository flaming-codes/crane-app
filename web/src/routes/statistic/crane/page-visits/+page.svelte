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
  import clsx from 'clsx';
  import type { PageServerData } from './$types';

  export let data: PageServerData;
  $: ({ grouped } = data);
</script>

<BasePageInit withBaseMeta={false} withBreadcrumb={false} />
<BaseMeta
  title={`Trending packages & authors on CRAN/E`}
  description={`Trending packages & authors for the last 24h`}
  path="/statistic/crane/page-visits"
/>
<BreadcrumbMeta
  items={[
    { name: 'Statistics', href: '/statistic' },
    { name: 'Github statistic', href: '/github/statistic' },
    { name: 'Trending packages & authors on CRAN/E', href: '/statistic/crane/page-visits' }
  ]}
/>
<CommonControls variant="translucent" />
<ColorScheme scheme="dark" />
<NotificationCenterAnchor />

<main>
  <Hero
    isFixed
    title="Trends on CRAN/E"
    titleSize="lg"
    subtitle="Packages & authors by most visits in the last 24h"
    subtitleSize="xl"
    height="50"
    variant="prominent"
    theme="gradient-dark-zinc"
  />

  <SheetContent
    offset="50"
    class="relative text-neutral-50 space-y-20 lg:space-y-52 pb-60 bg-zinc-900"
  >
    <Section withSpacingY="md" withPaddingX maxWidth="xl" class="mx-auto">
      {#if grouped.package.length === 0}
        <div class="text-center space-y-2 pt-10">
          <h3 class="text-xl">No package trends yet available</h3>
          <p class="text-lg text-neutral-300">
            Please try again later. If you think this is a bug, please report it at <a
              href="https://www.github.com/flaming-codes/crane-app"
              class="underline">our repo</a
            >.
          </p>
        </div>
      {/if}

      <SubGrid size="1" class="gap-8">
        {#each grouped.package as { page, visitors }}
          <SubGridItem withBorder withSpaceY="md" withValueSpaceY="xs" key="" emphasis="key">
            <Link slot="key" title={page} target={page} href={page}
              >Package <strong>{page.split('/').pop()}</strong></Link
            >
            <p class="flex items-center space-x-1 text-lg text-green-500">
              <span>
                + {visitors}
              </span>
            </p>
            <div class="flex items-center space-x-3 pt-2 text-neutral-200">
              <Link href={page} class="rounded border border-neutral-500 px-2 py-1 text-xs">
                Show on <strong>CRAN/E</strong>
              </Link>
            </div>
          </SubGridItem>
        {/each}
      </SubGrid>
    </Section>

    <Section withSpacingY="md" withPaddingX maxWidth="xl" class="mx-auto">
      {#if grouped.author.length === 0}
        <div class="text-center space-y-2 pt-10">
          <h3 class="text-xl">No author trends yet available</h3>
          <p class="text-lg text-neutral-300">
            Please try again later. If you think this is a bug, please report it at <a
              href="https://www.github.com/flaming-codes/crane-app"
              class="underline">our repo</a
            >.
          </p>
        </div>
      {/if}

      <SubGrid size="1" class="gap-8">
        {#each grouped.author as { page, visitors }}
          <SubGridItem withBorder withSpaceY="md" withValueSpaceY="xs" key="" emphasis="key">
            <Link slot="key" title={page} target={page} href={page}
              >Author <strong>{page.split('/').pop()}</strong></Link
            >
            <p class="flex items-center space-x-1 text-lg text-green-500">
              <span>
                + {visitors}
              </span>
            </p>
            <div class="flex items-center space-x-3 pt-2 text-neutral-200">
              <Link href={page} class="rounded border border-neutral-500 px-2 py-1 text-xs">
                Show on <strong>CRAN/E</strong>
              </Link>
            </div>
          </SubGridItem>
        {/each}
      </SubGrid>
    </Section>
  </SheetContent>
</main>
