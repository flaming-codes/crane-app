<script lang="ts">
  import Iconic from '$lib/blocks/views/Iconic.svelte';
  import ControlsLink from './ControlsLink.svelte';
</script>

<menu class="flex items-center">
  <slot name="start" />

  <ControlsLink withGap href="/binary" title="Download the R binary">
    <Iconic name="raphael:commandline" size="20" />
  </ControlsLink>
  <ControlsLink withGap href="/how-to" title="Guide for power users">
    <Iconic name="carbon:help" size="20" />
  </ControlsLink>
  <ControlsLink withGap href="/about" title="About this web app">
    <Iconic name="carbon:information" size="20" />
  </ControlsLink>

  <slot name="end" />
</menu>
