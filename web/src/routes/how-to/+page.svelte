<script lang="ts">
  import Hero from '$lib/blocks/views/Hero.svelte';
  import Kbd from '$lib/blocks/views/Kbd.svelte';
  import Section from '$lib/blocks/views/Section.svelte';
  import SectionHeader from '$lib/blocks/views/SectionHeader.svelte';
  import SectionsColumn from '$lib/blocks/views/SectionsColumn.svelte';
  import SectionTitleSelect from '$lib/blocks/views/SectionTitleSelect.svelte';
  import SubGrid from '$lib/blocks/views/SubGrid.svelte';
  import SubGridItem from '$lib/blocks/views/SubGridItem.svelte';
  import ControlsBase from '$lib/controls/views/ControlsBase.svelte';
  import ControlsLink from '$lib/controls/views/ControlsLink.svelte';
  import SearchControls from '$lib/controls/views/SearchControls.svelte';
  import ColorScheme from '$lib/display/views/ColorScheme.svelte';
  import PackageDetailSection from '$lib/page/views/PackageDetailSection.svelte';
  import SearchInit from '$lib/search/views/SearchInit.svelte';
  import BaseMeta from '$lib/seo/views/BaseMeta.svelte';
  import Icon from '@iconify/svelte';

  const titles = ['Usage', 'Shortcuts'];
</script>

<BaseMeta title="Guides" path="/how-to" />
<ColorScheme scheme="dark" />
<SearchInit />

{#await import('$lib/search/views/SearchInlinePanelResults.svelte') then Module}
  <Module.default isEnabled />
{/await}

<ControlsBase variant="dark">
  <SearchControls withTotal={false}>
    <svelte:fragment slot="links-start">
      <ControlsLink withGap href="/" title="Start">
        <Icon icon="carbon:switcher" />
      </ControlsLink>
    </svelte:fragment>
  </SearchControls>
</ControlsBase>

<main class="text-neutral-50 space-y-20 pb-60">
  <Hero title="How-To" subtitle="Shortcuts and general usage descriptions" height="70" />

  <Section withTwoFoldLayout withPaddingX={false} withSpacingY id="usage">
    <SectionHeader>
      <SectionTitleSelect selected="Usage" options={titles} />
    </SectionHeader>

    <SectionsColumn>
      <PackageDetailSection title="Search" withProse="dark">
        <div class="prose-lg">
          <p>
            The search bar at the bottom of the screen takes your input and runs a fuzzy-search
            against our database of metadata for each package.
          </p>
          <p>
            Fuzzy search means that it provides an experience similar to Google. You can type in a
            few letters and the search will return results that match your input based on a weighted
            algorithm.
          </p>
          <p>
            All results in the grid of packages are sorted by last publication date. The top most
            items are therefore also the most recently published packages.
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
            <Kbd withLowOpacity={false} text=":meta: F" theme="dark" />
          </SubGridItem>
          <SubGridItem key="Select search inline suggestion">
            <span>
              <Kbd withLowOpacity={false} text="Tab" theme="dark" />
              <span class="mx-2 text-xs"> or </span>
              <Kbd withLowOpacity={false} text="Enter" theme="dark" />
            </span>
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
</main>
