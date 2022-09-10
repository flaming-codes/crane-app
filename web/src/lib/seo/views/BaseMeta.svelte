<script lang="ts">
  import { MetaTags } from 'svelte-meta-tags';

  export let title: string;
  export let description: string =
    'CRAN/E provides a modern search expierence among all available R-packages';
  export let path: string | undefined = '';

  const url = `https://www.cran-e.com${path}`;
</script>

<MetaTags
  title="CRAN/E | {title}"
  {description}
  canonical={url}
  openGraph={{
    title: `CRAN/E | ${title}`,
    description,
    type: 'website',
    url,
    images: [
      {
        url: 'https://www.cran-e.com/images/og/cover-02.jpg',
        width: 1200,
        height: 630,
        alt: 'CRAN/E logo in written form, white text on a black background'
      }
    ]
  }}
/>
