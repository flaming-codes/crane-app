<script lang="ts">
  import { store } from '$lib/search/stores/search';

  const { state, typeAheadState } = store;

  $: {
    // For now, we're only using type ahead suggestions,
    // for the input on the package details page.
    if ($typeAheadState === 'ready') {
      $state = 'ready';
    }
  }
</script>
