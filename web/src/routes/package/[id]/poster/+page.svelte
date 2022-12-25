<script lang="ts">
  import Hero from '$lib/blocks/views/Hero.svelte';
  import PosterBrandLabel from '$lib/seo/views/PosterBrandLabel.svelte';
  import type { PageData } from './$types';

  export let data: PageData;
</script>

<Hero
  title={data.name}
  subtitle={data.title}
  height="screen"
  variant="prominent"
  theme="gradient-stone"
  textVariant="dense"
/>
