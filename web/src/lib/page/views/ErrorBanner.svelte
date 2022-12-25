<script lang="ts">
  import Hero from '$lib/blocks/views/Hero.svelte';
  import Iconic from '$lib/blocks/views/Iconic.svelte';
  import ControlsBase from '$lib/controls/views/ControlsBase.svelte';
  import ControlsLink from '$lib/controls/views/ControlsLink.svelte';
  import SearchControls from '$lib/controls/views/SearchControls.svelte';
  import ColorScheme from '$lib/display/views/ColorScheme.svelte';
  import SearchInit from '$lib/search/views/SearchInit.svelte';

  export let title: string = 'Not found';
  export let subtitle: string;
</script>

<ColorScheme scheme="dark" />
<SearchInit />
{#await import('$lib/search/views/SearchInlinePanelResults.svelte') then Module}
  <Module.default isEnabled />
{/await}

<ControlsBase variant="dark">
  <SearchControls withTotal={false}>
    <svelte:fragment slot="links-start">
      <ControlsLink withGap href="/" title="Overview latest packages">
        <Iconic name="carbon:switcher" size="16" />
      </ControlsLink>
    </svelte:fragment>
  </SearchControls>
</ControlsBase>

<Hero isFixed {title} {subtitle} height="screen" />
