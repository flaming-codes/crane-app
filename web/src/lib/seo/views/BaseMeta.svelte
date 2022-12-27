<script lang="ts">
  import { MetaTags } from 'svelte-meta-tags';

  export let title: string;
  export let description: string =
    'CRAN/E provides a modern search expierence among all available R-packages';
  export let path: string | undefined = '';
  export let image: { url: string; alt: string } | undefined = undefined;

  const url = `https://www.cran-e.com${path}`;
  const imageUrl = image?.url || 'https://www.cran-e.com/images/og/cover-01.jpg';
  const imageAlt = image?.alt || 'CRAN/E logo in written form, white text on a black background';
</script>

<MetaTags
  title="CRAN/E | {title}"
  {description}
  canonical={url}
  twitter={{
    handle: '@CodesFlaming',
    site: '@CodesFlaming',
    cardType: 'summary_large_image',
    image: imageUrl,
    imageAlt
  }}
  openGraph={{
    title: `CRAN/E | ${title}`,
    description,
    type: 'website',
    url,
    images: [
      {
        url: imageUrl,
        width: 1200,
        height: 630,
        alt: imageAlt
      }
    ]
  }}
/>
