<script lang="ts">
  import type { PageData } from './$types';
  import Hero from '$lib/blocks/views/Hero.svelte';
  import ControlsBase from '$lib/controls/views/ControlsBase.svelte';
  import SearchControls from '$lib/controls/views/SearchControls.svelte';
  import ColorScheme from '$lib/display/views/ColorScheme.svelte';
  import BaseMeta from '$lib/seo/views/BaseMeta.svelte';
  import SearchResults from '$lib/search/views/SearchResults.svelte';
  import clsx from 'clsx';

  export let data: PageData;
  const { initialAll } = data;
</script>

<BaseMeta title="The modern R-packages search engine" />
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
    <SearchControls theme="dark" />
  </ControlsBase>

  <div
    class={clsx({
      'bg-neutral-100 mt-[clamp(40vh,40vw,50vh)] text-black pb-10': true
    })}
  >
    <section id="packages" class="min-h-[100vh]">
      <SearchResults withHashEffect withScrollTopEffect {initialAll} />
    </section>
  </div>
</main>

<style>
  :root {
    color-scheme: light;
  }
</style>
