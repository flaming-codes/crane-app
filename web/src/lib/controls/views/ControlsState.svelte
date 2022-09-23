<script lang="ts">
  import { store } from '$lib/search/stores/search';

  import { format1kDelimiter } from '$lib/display/models/format';
  import Iconic from '$lib/blocks/views/Iconic.svelte';

  const { state, typeAheadState } = store;
  const { total } = store.hits;

  export let withTotal: boolean | undefined = true;

  $: isLoading = $state === 'searching' || $typeAheadState === 'init';
</script>

<div class="font-mono flex items-center gap-x-4">
  {#if isLoading}
    <div class="animate-spin">
      <Iconic hFlip name="carbon:renew" />
    </div>
  {/if}
  {#if withTotal}
    <div class="hidden smx:block text-xs whitespace-nowrap">
      {format1kDelimiter($total)}
      {`${$total === 1 ? 'package' : 'packages'}`}
    </div>
  {/if}
</div>
