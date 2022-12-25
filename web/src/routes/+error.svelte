<script lang="ts">
  import { page } from '$app/stores';

  import { browser } from '$app/environment';
  import { sendEvent } from '$lib/analytics/model';
  import Hero from '$lib/blocks/views/Hero.svelte';
  import Iconic from '$lib/blocks/views/Iconic.svelte';
  import ControlsBase from '$lib/controls/views/ControlsBase.svelte';
  import ControlsLink from '$lib/controls/views/ControlsLink.svelte';
  import SearchControls from '$lib/controls/views/SearchControls.svelte';
  import ColorScheme from '$lib/display/views/ColorScheme.svelte';
  import SearchInit from '$lib/search/views/SearchInit.svelte';

  $: {
    if (browser) {
      sendEvent('unexpected-error', {
        props: { reason: $page.error?.message || 'unknown' }
      });
    }
  }
</script>

<ColorScheme scheme="dark" />
<SearchInit />
{#await import('$lib/search/views/SearchInlinePanelResults.svelte') then Module}
  <Module.default isEnabled />
{/await}

<ControlsBase variant="dark">
  <SearchControls withTotal={false}>
    <svelte:fragment slot="links-start">
      <ControlsLink withGap href="/" title="Latest packages">
        <Iconic name="carbon:switcher" size="16" />
      </ControlsLink>
    </svelte:fragment>
  </SearchControls>
</ControlsBase>

<Hero
  title="Error"
  subtitle={$page.error?.message || 'An unexpected error happend'}
  height="screen"
  isFixed={true}
/>
