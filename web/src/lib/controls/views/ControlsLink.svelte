<script lang="ts">
  import Link from '$lib/display/views/Link.svelte';
  import { getControlsItemStyle } from '../styles/controls-item';

  export let href: string;
  export let title: string;
  export let ariaLabel: string | undefined = undefined;
  export let withGap: boolean | undefined = undefined;
  export let withForcedReload: true | undefined = undefined;
</script>

<Link
  {href}
  {title}
  {withForcedReload}
  ariaLabel={ariaLabel || title}
  class={getControlsItemStyle({ withGap })}
>
  <slot />
</Link>
