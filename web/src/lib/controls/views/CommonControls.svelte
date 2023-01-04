<script lang="ts">
  import Iconic from '$lib/blocks/views/Iconic.svelte';
  import type { ControlsBaseVariant } from '../types/controls-base';
  import ControlsBase from './ControlsBase.svelte';
  import ControlsLink from './ControlsLink.svelte';
  import SearchControls from './SearchControls.svelte';

  export let variant: ControlsBaseVariant = 'black';
</script>

<ControlsBase {variant}>
  <SearchControls withTotal={false}>
    <svelte:fragment slot="links-start">
      <ControlsLink withGap href="/" title="Latest packages">
        <Iconic name="carbon:switcher" size="16" />
      </ControlsLink>
      <ControlsLink withGap href="/statistics" title="Statistics">
        <Iconic name="carbon:chart-line" size="16" />
      </ControlsLink>
    </svelte:fragment>
  </SearchControls>
</ControlsBase>
