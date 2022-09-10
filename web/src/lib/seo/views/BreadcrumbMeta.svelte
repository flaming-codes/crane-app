<script lang="ts">
  import { browser } from '$app/environment';
  import { JsonLd } from 'svelte-meta-tags';

  export let items: Array<{ name: string; href: string }> = [];
</script>

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
