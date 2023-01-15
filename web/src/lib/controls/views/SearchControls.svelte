<script lang="ts">
  import SearchInput from '$lib/search/views/SearchInput.svelte';
  import CommonLinks from './CommonLinks.svelte';
  import ControlsState from './ControlsState.svelte';

  export let theme: 'light' | 'dark' = 'dark';
  export let withTotal: boolean | undefined = true;
</script>

<SearchInput {theme} />

<div class="flex gap-x-2 sm:gap-x-4 md:gap-x-6 justify-end">
  <ControlsState {withTotal} />
  <CommonLinks>
    <svelte:fragment slot="start">
      <slot name="links-start" />
    </svelte:fragment>
    <svelte:fragment slot="end">
      <slot name="links-end" />
    </svelte:fragment>
  </CommonLinks>
</div>
