<script lang="ts">
  import type { PageData } from './$types';
  import Hero from '$lib/blocks/views/Hero.svelte';
  import ControlsBase from '$lib/controls/views/ControlsBase.svelte';
  import SearchControls from '$lib/controls/views/SearchControls.svelte';
  import ColorScheme from '$lib/display/views/ColorScheme.svelte';
  import BaseMeta from '$lib/seo/views/BaseMeta.svelte';
  import SearchResults from '$lib/search/views/SearchResults.svelte';
  import BreadcrumbMeta from '$lib/seo/views/BreadcrumbMeta.svelte';
  import Iconic from '$lib/blocks/views/Iconic.svelte';
  import ControlsLink from '$lib/controls/views/ControlsLink.svelte';

  export let data: PageData;
  const { initialAll } = data;
</script>

<BaseMeta title="The modern R-packages search engine" />
<BreadcrumbMeta />
<ColorScheme scheme="light" />

<main>
  <Hero
    isFixed
    title="CRAN/E"
    subtitle="The modern R-packages search engine"
    height="50"
    theme="dark"
  />

  <!-- We're mounting 'Controls' here so that tab-focus starts with the search input. -->
  <ControlsBase variant="black">
    <SearchControls theme="dark">
      <svelte:fragment slot="links-start">
        <ControlsLink withGap href="/statistics" title="Statistics">
          <Iconic name="carbon:chart-line" size="16" />
        </ControlsLink>
      </svelte:fragment>
    </SearchControls>
  </ControlsBase>

  <div class="bg-white mt-[clamp(40vh,40vw,50vh)] text-black pb-10">
    <section id="packages" class="min-h-screen scroll-mt-nav">
      <SearchResults withHashEffect withScrollTopEffect {initialAll} />
    </section>
  </div>
</main>
