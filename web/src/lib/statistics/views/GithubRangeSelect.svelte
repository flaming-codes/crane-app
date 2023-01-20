<script lang="ts">
  import { mapRangeToLabel } from '../models/github';

  export let composeHref: (value: string) => string;
  export let title = 'Trends for last';
  export let ranges: readonly string[] = [];
  export let selectedRange: string;
</script>

<div class="sticky top-nav py-3 backdrop-blur-lg text-lg flex items-center justify-center gap-x-2">
  {title}
  <select
    bind:value={selectedRange}
    class="appearance-none bg-black/0 overflow-hidden border border-neutral-500 px-2 rounded cursor-pointer"
    on:change={(ev) => {
      const { value } = ev.currentTarget;
      window.location.replace(composeHref(value));
    }}
  >
    {#each ranges as range}
      <option value={range}>{mapRangeToLabel(range)}</option>
    {/each}
  </select>
</div>
