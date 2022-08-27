<script lang="ts">
  import SvelteSeo from 'svelte-seo';
  import type { SvelteSeoProps } from 'svelte-seo/types/SvelteSeo';

  export let title: string;
  export let description: string =
    'CRAN/E provides a modern search expierence among all available R-packages';
  export let path: string | undefined = '';
  export let jsonLd: SvelteSeoProps['jsonLd'] | undefined = undefined;

  const url = `https://cran-e.com${path}`;
</script>

<SvelteSeo
  nofollow
  noindex
  title="CRAN/E | {title}"
  {description}
  keywords="r, cran, packages, search, engine"
  canonical={url}
  openGraph={{
    title: `CRAN/E | ${title}`,
    description,
    type: 'website',
    url,
    images: [
      {
        url: 'https://cran-e.com/images/og/cover-01.jpg',
        width: 1200,
        height: 630,
        alt: 'CRAN/E logo in written form, white text on a black background'
      }
    ]
  }}
  {jsonLd}
/>
