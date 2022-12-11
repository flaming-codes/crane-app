<script lang="ts">
  import { store } from '$lib/search/stores/search';

  import Hero from '$lib/blocks/views/Hero.svelte';
  import Iconic from '$lib/blocks/views/Iconic.svelte';
  import ControlsBase from '$lib/controls/views/ControlsBase.svelte';
  import ControlsLink from '$lib/controls/views/ControlsLink.svelte';
  import SearchControls from '$lib/controls/views/SearchControls.svelte';
  import ColorScheme from '$lib/display/views/ColorScheme.svelte';
  import SearchInit from '$lib/search/views/SearchInit.svelte';
  import type { PageData } from './$types';
  import { browser } from '$app/environment';
  import { getCssVarRemToPixels } from '$lib/display/models/parse';
  import Section from '$lib/blocks/views/Section.svelte';
  import SectionHeader from '$lib/blocks/views/SectionHeader.svelte';
  import SectionTitleSelect from '$lib/blocks/views/SectionTitleSelect.svelte';
  import SectionsColumn from '$lib/blocks/views/SectionsColumn.svelte';
  import PackageDetailSection from '$lib/page/views/PackageDetailSection.svelte';

  const { hits, input: searchInput } = store;
  const { items: searchItems } = hits;

  export let data: PageData;
  const { id } = data;
  const slug = encodeURIComponent(id);

  let y = 0;

  const titles = ['About', 'Packages', 'Team'];

  const getHeroScrollDelta = () => {
    const halfWindowHeight = browser ? window.innerHeight / 2 : 0;
    const baseControlsHeight = browser ? getCssVarRemToPixels('--base-controls-h-sm') : 0;
    return halfWindowHeight - baseControlsHeight;
  };

  $: isNavDark = ($searchItems.length && $searchInput) || y > getHeroScrollDelta();
</script>

<!-- Meta -->

<svelte:window bind:scrollY={y} />

<ColorScheme scheme="dark" />
<SearchInit />
{#await import('$lib/search/views/SearchInlinePanelResults.svelte') then Module}
  <Module.default isEnabled />
{/await}

<!-- Header controls -->

<ControlsBase variant={isNavDark ? 'black' : 'transparent'} class="text-white">
  <SearchControls withTotal={false} theme="dark">
    <svelte:fragment slot="links-start">
      <ControlsLink withGap href="/" title="Latest packages">
        <Iconic name="carbon:switcher" size="16" />
      </ControlsLink>
    </svelte:fragment>
  </SearchControls>
</ControlsBase>

<!-- Hero -->

<Hero
  isFixed
  title={id}
  titleSize="lg"
  subtitle="Category"
  height="50!"
  variant="prominent"
  theme="gradient-dark-zinc"
  textVariant="fit"
/>

<!-- Main content -->

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
      <PackageDetailSection title="Quick info" id="quick info">SheetContent</PackageDetailSection>
    </SectionsColumn>
  </Section>
</main>
