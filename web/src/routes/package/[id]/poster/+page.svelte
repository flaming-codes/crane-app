<script lang="ts">
  import OpenGraphImage from '$lib/seo/views/OpenGraphImage.svelte';
  import type { PageData } from './$types';

  export let data: PageData;
</script>

<OpenGraphImage
  title={data.name}
  subtitle={data.title}
  theme="gradient-stone"
  textVariant="dense"
/>
