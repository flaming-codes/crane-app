<script lang="ts">
  import { store } from '$lib/search/stores/search';

  import { browser } from '$app/environment';
  import ControlsBase from '$lib/controls/views/ControlsBase.svelte';
  import SearchControls from '$lib/controls/views/SearchControls.svelte';
  import ColorScheme from '$lib/display/views/ColorScheme.svelte';
  import NotificationCenterAnchor from '$lib/notification/view/NotificationCenterAnchor.svelte';
  import SearchInit from '$lib/search/views/SearchInit.svelte';
  import BaseMeta from '$lib/seo/views/BaseMeta.svelte';
  import BreadcrumbMeta from '$lib/seo/views/BreadcrumbMeta.svelte';
  import type { PageData } from './$types';
  import ControlsLink from '$lib/controls/views/ControlsLink.svelte';
  import Iconic from '$lib/blocks/views/Iconic.svelte';
  import Hero from '$lib/blocks/views/Hero.svelte';
  import SectionHeader from '$lib/blocks/views/SectionHeader.svelte';
  import SectionTitleSelect from '$lib/blocks/views/SectionTitleSelect.svelte';
  import Section from '$lib/blocks/views/Section.svelte';
  import SectionsColumn from '$lib/blocks/views/SectionsColumn.svelte';
  import PackageDetailSection from '$lib/page/views/PackageDetailSection.svelte';
  import SubGrid from '$lib/blocks/views/SubGrid.svelte';
  import SubGridItem from '$lib/blocks/views/SubGridItem.svelte';
  import Link from '$lib/display/views/Link.svelte';
  import PersonMeta from '$lib/seo/views/PersonMeta.svelte';
  import FaqMeta from '$lib/seo/views/FaqMeta.svelte';

  const { hits, input: searchInput } = store;
  const { items: searchItems } = hits;

  export let data: PageData;
  const { id, packages } = data;
  const slug = encodeURIComponent(id);

  let y = 0;

  const titles = ['Packages'];

  const getHeroScrollDelta = () => {
    const halfWindowHeight = browser ? window.innerHeight / 2 : 0;
    const baseControlsHeight = browser
      ? getComputedStyle(document.documentElement).getPropertyValue('--base-controls-h-sm')
      : '0';
    return halfWindowHeight - parseInt(baseControlsHeight, 10);
  };

  $: isNavDark = ($searchItems.length && $searchInput) || y > getHeroScrollDelta();
</script>

<BaseMeta title="R Packages from {id}" description="All packages for {id}" path="/author/{slug}" />
<PersonMeta name={id} />
<BreadcrumbMeta
  items={[
    { name: 'Authors', href: '/author' },
    { name: id, href: `/author/${slug}` }
  ]}
/>
<FaqMeta
  items={[
    {
      q: `How many R-packges are linked to ${id}?`,
      a: `${packages.length} R-packages are linked to ${id}.`
    },
    {
      q: `What R-packges does ${id} work on?`,
      a: packages.map((p) => p.name).join(', ')
    }
  ]}
/>

<ColorScheme scheme="dark" />
<NotificationCenterAnchor />

<SearchInit />
{#await import('$lib/search/views/SearchInlinePanelResults.svelte') then Module}
  <Module.default isEnabled />
{/await}

<svelte:window bind:scrollY={y} />

<ControlsBase variant={isNavDark ? 'black' : 'translucent'} class="text-white">
  <SearchControls withTotal={false} theme="dark">
    <svelte:fragment slot="links-start">
      <ControlsLink withGap href="/" title="Latest packages">
        <Iconic name="carbon:switcher" size="16" />
      </ControlsLink>
    </svelte:fragment>
  </SearchControls>
</ControlsBase>

<Hero
  isFixed
  title={id}
  titleSize="lg"
  subtitle={`Author of ${packages.length} ${packages.length === 1 ? 'package' : 'packages'}`}
  height="50!"
  variant="prominent"
  theme="gradient-dark"
  textVariant="fit"
/>

<main
  class={`
    absolute top-0 left-0 right-0 mt-[50vh] min-h-[100vh] pb-20 space-y-8 bg-zinc-900 text-gray-100
    md:space-y-12 
    lg:space-y-16
  `}
>
  <!-- Packages -->
  <Section withTwoFoldLayout withPaddingX={false} id="packages">
    <SectionHeader>
      <SectionTitleSelect selected="Packages" options={titles} />
    </SectionHeader>

    <SectionsColumn>
      <PackageDetailSection title="Quick links" id="quick links">
        <SubGrid>
          {#each packages as { name, slug }}
            <SubGridItem
              withKeyTruncate
              key={name}
              emphasis="key"
              url="/package/{slug}"
              urlTarget="_self"
            >
              <Link withForcedReload href="/package/{slug}">
                <Iconic name="carbon:arrow-right" />
              </Link>
            </SubGridItem>
          {/each}
        </SubGrid>
      </PackageDetailSection>
      <PackageDetailSection title="Package details" id="package details">
        <SubGrid>
          {#each packages as { name, title, slug, author_names }}
            <SubGridItem
              key={name}
              emphasis="key"
              class="col-span-full"
              withSpaceY="xs"
              withValueSpaceY="xs"
            >
              <p class="text-neutral-300 text-lg">{title}</p>
              <p class="text-sml leading-6">
                {author_names.length === 1 ? 'Author:' : 'Authors:'}
                {#each author_names as author, i}
                  <Link withForcedReload href="/author/{author}">{author}</Link>
                  {#if i < author_names.length - 1}
                    {', '}
                  {/if}
                {/each}
              </p>
              <Link href="/package/{slug}" class="inline-block pt-2">
                <Iconic name="carbon:arrow-right" />
              </Link>
            </SubGridItem>
          {/each}
        </SubGrid>
      </PackageDetailSection>
    </SectionsColumn>
  </Section>
</main>
