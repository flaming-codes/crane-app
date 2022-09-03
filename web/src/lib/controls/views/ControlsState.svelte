<script lang="ts">
  import { store } from '$lib/search/stores/search';

  import Icon from '@iconify/svelte';
  import { formatDelimiter } from '$lib/display/models/format';

  const { state, typeAheadState } = store;
  const { total } = store.hits;

  export let withTotal: boolean | undefined = true;

  $: isLoading = $state === 'searching' || $typeAheadState === 'init';
</script>

<div class="font-mono flex items-center gap-x-4">
  {#if isLoading}
    <div class="animate-spin">
      <Icon icon="carbon:renew" hFlip={true} />
    </div>
  {/if}
  {#if withTotal}
    <div class="hidden smx:block text-xs whitespace-nowrap">
      {formatDelimiter($total)}
      {`${$total === 1 ? 'package' : 'packages'}`}
    </div>
  {/if}
</div>
