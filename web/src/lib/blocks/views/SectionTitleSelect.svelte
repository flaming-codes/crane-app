<script lang="ts">
  import { goto } from '$app/navigation';
  import Iconic from './Iconic.svelte';

  export let options: string[];
  export let selected: typeof options[number];

  let ref: any;
</script>

<div class="relative flex items-center gap-x-2">
  <Iconic name="carbon:chevron-sort" size="16" class="hidden lg:inline" />
  <select
    value={selected}
    class="appearance-none bg-transparent overflow-hidden border-none cursor-pointer"
    bind:this={ref}
    on:change|preventDefault|stopPropagation={(ev) => {
      goto(`#${ev.currentTarget.value.toLowerCase()}`);
      ref.selectedIndex = options.indexOf(selected);
    }}
  >
    {#each options as option}
      <option
        value={option}
        selected={selected === option}
        disabled={option === selected}
        class="overflow-hidden">{option}</option
      >
    {/each}
  </select>
</div>
