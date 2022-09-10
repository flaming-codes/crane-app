<script lang="ts">
  import SvelteSeo from 'svelte-seo';

  export let name: string;
</script>

<SvelteSeo
  jsonLd={{
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: name,
    url: 'https://www.cran-e.com/author/' + encodeURIComponent(name)
  }}
/>
