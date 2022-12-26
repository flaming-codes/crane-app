<script lang="ts">
  import OpenGraphImage from '$lib/seo/views/OpenGraphImage.svelte';
  import type { PageData } from './$types';

  export let data: PageData;
</script>

<OpenGraphImage
  title={data.id}
  titleSize="lg"
  subtitleSize="xl"
  subtitle={`Author of ${data.packageNames.length} R ${
    data.packageNames.length === 1 ? 'package' : 'packages'
  }`}
  textVariant="fit"
  theme="gradient-black-slate"
/>
