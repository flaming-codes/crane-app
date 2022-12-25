<script lang="ts">
  import Hero from '$lib/blocks/views/Hero.svelte';
  import PosterBrandLabel from '$lib/seo/views/PosterBrandLabel.svelte';
  import type { PageData } from './$types';

  export let data: PageData;
</script>

<Hero
  isFixed
  title={data.id}
  titleSize="lg"
  subtitleSize="xl"
  subtitle={`Author of ${data.packageNames.length} ${
    data.packageNames.length === 1 ? 'package' : 'packages'
  }`}
  height="screen"
  variant="prominent"
  theme="gradient-black-slate"
  textVariant="fit"
/>
