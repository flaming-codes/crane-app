<script lang="ts">
  import SvelteSeo from 'svelte-seo';

  export let items: Array<{ q: string; a: string }>;
</script>

<SvelteSeo
  jsonLd={{
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item, i) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.a
      }
    }))
  }}
/>
