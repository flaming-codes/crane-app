<script lang="ts">
  import { browser } from '$app/environment';
  import { JsonLd } from 'svelte-meta-tags';

  export let items: Array<{ name: string; href: string }> = [];
</script>

<!-- Only run on server (https://github.com/oekazuma/svelte-meta-tags/issues/372) -->
{#if !browser}
  <JsonLd
    schema={{
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [{ name: 'CRAN/E', href: '' }, ...items].map((item, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: item.name,
        item: 'https://www.cran-e.com' + item.href
      }))
    }}
  />
{/if}
