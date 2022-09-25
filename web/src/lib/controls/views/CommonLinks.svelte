<script lang="ts">
  import Iconic from '$lib/blocks/views/Iconic.svelte';
  import PwaInstallPromptButton from '$lib/pwa/views/PWAInstallPromptButton.svelte';
  import { getControlsItemStyle } from '../styles/controls-item';
  import ControlsLink from './ControlsLink.svelte';
</script>

<menu class="flex items-center">
  <slot name="start" />

  <ControlsLink withGap href="/how-to" title="Guide for power users">
    <Iconic name="carbon:help" size="20" />
  </ControlsLink>
  <ControlsLink withGap href="/about" title="About this web app">
    <Iconic name="carbon:information" size="20" />
  </ControlsLink>
  <PwaInstallPromptButton class={getControlsItemStyle({ withGap: true })} />

  <slot name="end" />
</menu>
