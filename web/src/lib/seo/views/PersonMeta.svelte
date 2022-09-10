<script lang="ts">
  import { browser } from '$app/environment';
  import { JsonLd } from 'svelte-meta-tags';

  export let name: string;
</script>

{#if !browser}
  <JsonLd
    schema={{
      '@context': 'https://schema.org',
      '@type': 'Person',
      name: name,
      url: 'https://www.cran-e.com/author/' + encodeURIComponent(name)
    }}
  />
{/if}
