<script lang="ts">
  import Hero from '$lib/blocks/views/Hero.svelte';
  import Iconic from '$lib/blocks/views/Iconic.svelte';
  import Kbd from '$lib/blocks/views/Kbd.svelte';
  import Section from '$lib/blocks/views/Section.svelte';
  import SectionHeader from '$lib/blocks/views/SectionHeader.svelte';
  import SectionsColumn from '$lib/blocks/views/SectionsColumn.svelte';
  import SectionTitleSelect from '$lib/blocks/views/SectionTitleSelect.svelte';
  import SheetContent from '$lib/blocks/views/SheetContent.svelte';
  import SubGrid from '$lib/blocks/views/SubGrid.svelte';
  import SubGridIcon from '$lib/blocks/views/SubGridIcon.svelte';
  import SubGridItem from '$lib/blocks/views/SubGridItem.svelte';
  import ControlsBase from '$lib/controls/views/ControlsBase.svelte';
  import ControlsLink from '$lib/controls/views/ControlsLink.svelte';
  import SearchControls from '$lib/controls/views/SearchControls.svelte';
  import ColorScheme from '$lib/display/views/ColorScheme.svelte';
  import Link from '$lib/display/views/Link.svelte';
  import PackageDetailSection from '$lib/page/views/PackageDetailSection.svelte';
  import SearchInit from '$lib/search/views/SearchInit.svelte';
  import BaseMeta from '$lib/seo/views/BaseMeta.svelte';
  import BreadcrumbMeta from '$lib/seo/views/BreadcrumbMeta.svelte';

  const titles = ['Usage', 'Shortcuts', 'Authors'];
</script>

<BaseMeta title="Guides" path="/how-to" />
<BreadcrumbMeta items={[{ name: 'Guides and Shortcuts', href: '/how-to' }]} />
<ColorScheme scheme="dark" />
<SearchInit />
{#await import('$lib/search/views/SearchInlinePanelResults.svelte') then Module}
  <Module.default isEnabled />
{/await}

<ControlsBase variant="black">
  <SearchControls withTotal={false}>
    <svelte:fragment slot="links-start">
      <ControlsLink withGap href="/" title="Latest packages">
        <Iconic name="carbon:switcher" size="16" />
      </ControlsLink>
    </svelte:fragment>
  </SearchControls>
</ControlsBase>

<main>
  <Hero
    isFixed
    title="How-To"
    subtitle="Shortcuts and general usage descriptions"
    height="50"
    theme="dark"
  />

  <SheetContent offset="50" class=" text-neutral-50 space-y-20 pb-60 bg-zinc-900">
    <Section withTwoFoldLayout withPaddingX={false} withSpacingY id="usage">
      <SectionHeader>
        <SectionTitleSelect selected="Usage" options={titles} />
      </SectionHeader>

      <SectionsColumn>
        <PackageDetailSection title="Search" withProse="dark">
          <div class="prose-lg">
            <p>
              The search bar at the top of the screen takes your input and runs a fuzzy-search
              against our database of metadata for each package and author.
            </p>
            <p>
              Fuzzy search means that it provides an experience similar to Google. You can type in a
              few letters and the search will return results that match your input based on a
              weighted algorithm.
            </p>
            <p>
              All results in the grid of packages are sorted by last publication date if no search
              input is provided. The topmost items are therefore also the most recently published
              packages. Once you start typing, the results are sorted by relevance. The topmost
              items are therefore the most relevant to your search input. This is true for both
              packages and authors.
            </p>
          </div>
        </PackageDetailSection>
      </SectionsColumn>
    </Section>

    <Section withTwoFoldLayout withPaddingX={false} id="shortcuts">
      <SectionHeader>
        <SectionTitleSelect selected="Shortcuts" options={titles} />
      </SectionHeader>

      <SectionsColumn>
        <PackageDetailSection title="Everywhere">
          <SubGrid>
            <SubGridItem key="Focus search">
              <Kbd withLowOpacity={false} text=":meta: K" theme="dark" />
            </SubGridItem>
            <SubGridItem key="Select search inline suggestion">
              <span>
                <Kbd withLowOpacity={false} text="Enter" theme="dark" />
              </span>
            </SubGridItem>
            <SubGridItem key="Show the adjacent inline suggestion">
              <div class="space-y-2 mt-1">
                <Kbd withLowOpacity={false} text="Arrow Down" theme="dark" class="inline-block" />
                <Kbd withLowOpacity={false} text="Arrow Up" theme="dark" class="inline-block" />
              </div>
            </SubGridItem>
          </SubGrid>
        </PackageDetailSection>
        <PackageDetailSection title="Package detail page">
          <SubGrid>
            <SubGridItem key="Copy install command">
              <Kbd withLowOpacity={false} text=":meta: Shift C" theme="dark" />
            </SubGridItem>
          </SubGrid>
        </PackageDetailSection>
      </SectionsColumn>
    </Section>

    <Section withTwoFoldLayout withPaddingX={false} id="authors">
      <SectionHeader>
        <SectionTitleSelect selected="Authors" options={titles} />
      </SectionHeader>

      <SectionsColumn>
        <PackageDetailSection title="On package site" withProse="dark">
          <div>
            <p>
              Maintainer and author information is available on each package site. You can click the
              icon that shows an avatar to reach any maintainer's or author's detail page.
            </p>
            <p>
              An example illustration below shows how such an element looks like. Simply click the
              leftmost icon below the email address to reach the author page.
            </p>
          </div>

          <SubGrid class="not-prose">
            <SubGridItem key="Maintainer" withValueSpaceY="md">
              {@const meta = { mail: 'lukas.schoenmann@outlook.com' }}
              {@const value = 'Lukas Schönmann'}
              <p>Lukas Schönmann</p>
              <div class="text-xs text-neutral-300 font-mono">lukas.schoenmann@outlook.com</div>
              <div class="flex gap-x-3 pt-1">
                <Link
                  withForcedReload
                  href="/author/{value}"
                  ariaLabel="All packages for {value}"
                  title="All packages for {value}"
                  class="text-white"
                >
                  <Iconic name="carbon:user-profile" />
                </Link>
                <SubGridIcon {meta} />
              </div>
            </SubGridItem>
          </SubGrid>
        </PackageDetailSection>
      </SectionsColumn>
    </Section>
  </SheetContent>
</main>
