<script lang="ts">
  import { browser } from '$app/environment';
  import { JsonLd } from 'svelte-meta-tags';

  export let items: Array<{ q: string; a: string }>;
</script>

{#if !browser}
  <JsonLd
    schema={{
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
{/if}
