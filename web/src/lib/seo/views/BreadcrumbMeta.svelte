<script lang="ts">
  import SvelteSeo from 'svelte-seo';

  export let items: Array<{ name: string; href: string }> = [];
</script>

<SvelteSeo
  jsonLd={{
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
