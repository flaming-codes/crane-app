<script lang="ts">
  import ColorScheme from '$lib/display/views/ColorScheme.svelte';
  import SearchInit from '$lib/search/views/SearchInit.svelte';
  import BaseMeta from '$lib/seo/views/BaseMeta.svelte';
  import BreadcrumbMeta from '$lib/seo/views/BreadcrumbMeta.svelte';

  export let title: string | undefined = undefined;
  export let path: string | undefined = undefined;
  export let withBaseMeta: boolean = true;
  export let withBreadcrumb: boolean = true;
</script>

{#if title && path && withBaseMeta}
  <BaseMeta {title} {path} />
{/if}
{#if title && path && withBreadcrumb}
  <BreadcrumbMeta items={[{ name: title, href: path }]} />
{/if}
<ColorScheme scheme="dark" />

<SearchInit />
{#await import('$lib/search/views/SearchInlinePanelResults.svelte') then Module}
  <Module.default isEnabled />
{/await}
