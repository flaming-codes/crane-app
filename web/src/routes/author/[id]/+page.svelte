<script lang="ts">
  import { store } from '$lib/search/stores/search';
  import { store as notificationStore } from '$lib/notification/store/store';

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
  import { getCssVarRemToPixels } from '$lib/display/models/parse';

  const { hits, input: searchInput } = store;
  const { items: searchItems } = hits;
  const { queue } = notificationStore;

  export let data: PageData;
  $: ({ id, packages, otherAuthors, totalOtherAuthors, links, activeEventType } = data);

  $: slug = encodeURIComponent(id);

  let y = 0;

  const titles = ['About', 'Packages', 'Team'];

  const getHeroScrollDelta = () => {
    const halfWindowHeight = browser ? window.innerHeight / 2 : 0;
    const baseControlsHeight = browser ? getCssVarRemToPixels('--base-controls-h-sm') : 0;
    return halfWindowHeight - baseControlsHeight;
  };

  $: isNavDark = ($searchItems.length && $searchInput) || y > getHeroScrollDelta();
</script>

<BaseMeta
  title="R Packages from {id}"
  description="All packages for {id}"
  path="/author/{slug}"
  image={{
    url: `https://cran-e.com/api/author/${slug}/poster.jpeg`,
    alt: `Poster for ${id}`
  }}
/>
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

<ControlsBase variant={isNavDark ? 'black' : 'transparent'} class="text-white">
  <SearchControls withTotal={false} theme="dark">
    <svelte:fragment slot="links-start">
      <ControlsLink withGap href="/" title="Latest packages">
        <Iconic name="carbon:switcher" size="16" />
      </ControlsLink>
      <ControlsLink withGap href="/statistic" title="Statistics">
        <Iconic name="carbon:chart-line" size="16" />
      </ControlsLink>
    </svelte:fragment>
  </SearchControls>
</ControlsBase>

<Hero
  isFixed
  title={id}
  titleSize="lg"
  subtitle={`Author of ${packages.length} R ${packages.length === 1 ? 'package' : 'packages'}`}
  height="50!"
  variant="prominent"
  theme="gradient-black-slate"
  textVariant="fit"
/>

<main
  class={`
    absolute top-0 left-0 right-0 mt-[50vh] min-h-[100vh] pt-8 pb-20 space-y-8 bg-zinc-900 text-neutral-100
    md:space-y-16
  `}
>
  <Section withTwoFoldLayout withPaddingX={false} id="about">
    <SectionHeader>
      <SectionTitleSelect selected="About" options={titles} />
    </SectionHeader>
    <SectionsColumn>
      <PackageDetailSection title="Quick info" id="quick info">
        <p class="prose prose-lg prose-invert max-w-none">
          {id} has worked on {packages.length}
          {packages.length === 1 ? 'package' : 'packages'} so far. In total, {id} has worked with {totalOtherAuthors}
          other {totalOtherAuthors === 1 ? 'author' : 'authors'} on those packages.
          {#if totalOtherAuthors === 0}
            A true lone wolf!
          {:else if totalOtherAuthors < 5}
            Nice teamwork!
          {:else if totalOtherAuthors < 10}
            A true team player!
          {:else if totalOtherAuthors < 100}
            Impressive teamwork!
          {:else}
            This amount of teamwork is mind-blowing! A true legend.
          {/if}
        </p>

        {#if links?.length}
          <SubGrid>
            {#each links as link}
              <SubGridItem
                withKeyTruncate
                key={link.startsWith('https://orcid.org/') ? 'ORCiD' : 'Link'}
                emphasis="key"
                withSpaceY="xs"
              >
                <Link
                  href={link}
                  ariaLabel="More information about {id}"
                  class="space-y-1"
                  target="_blank"
                  rel="noopener"
                >
                  <div>{link.replace('https://orcid.org/', '')}</div>
                  <Iconic
                    name={link.startsWith('https://orcid.org/')
                      ? 'la:orcid'
                      : 'carbon:arrow-up-right'}
                  />
                </Link>
              </SubGridItem>
            {/each}
          </SubGrid>
        {/if}
      </PackageDetailSection>
    </SectionsColumn>
  </Section>

  <!-- Packages -->
  <Section withTwoFoldLayout withPaddingX={false} id="packages">
    <SectionHeader>
      <SectionTitleSelect selected="Packages" options={titles} />
    </SectionHeader>

    <SectionsColumn spaceY="lg">
      <PackageDetailSection title="Packages overview" id="packages overview">
        <SubGrid>
          {#each packages as { name, slug }}
            <SubGridItem
              withKeyTruncate
              key={name}
              emphasis="key"
              url="/package/{slug}"
              urlTarget="_self"
            >
              <Link href="/package/{slug}">
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
              class="col-span-full xl:col-span-2"
              withSpaceY="xs"
              withValueSpaceY="xs"
            >
              <p class="text-neutral-300 text-lg">{title}</p>
              <p class="text-sml leading-6">
                {#each author_names as author, i}
                  <Link href="/author/{author}">{author}</Link>
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

  <Section withTwoFoldLayout withPaddingX={false} id="team">
    <SectionHeader>
      <SectionTitleSelect selected="Team" options={titles} />
    </SectionHeader>
    <SectionsColumn>
      <PackageDetailSection title="Colleagues" id="colleagues">
        <SubGrid>
          {#each otherAuthors as name}
            <SubGridItem key={name} withSpaceY="xs" withValueSpaceY="xs">
              <Link href="/author/{name}">
                <Iconic name="carbon:arrow-right" />
              </Link>
            </SubGridItem>
          {/each}
        </SubGrid>
      </PackageDetailSection>
    </SectionsColumn>
  </Section>
</main>

<!-- Event visuals. -->

{#if activeEventType === 'birthday'}
  {#await import('$lib/blocks/views/ViewportConfetti.svelte') then Module}
    <Module.default
      mountEffect={() => {
        notificationStore.push($queue, {
          type: 'neutral',
          value: '🎉 🎈 🎊 Happy birthday! 🥳 🎂 🎁',
          duration: 8_000,
          meta: {
            align: 'center'
          }
        });
      }}
    />
  {/await}
{/if}
