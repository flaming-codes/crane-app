<script lang="ts">
  import Hero from '$lib/blocks/views/Hero.svelte';
  import Section from '$lib/blocks/views/Section.svelte';
  import SheetContent from '$lib/blocks/views/SheetContent.svelte';
  import CommonControls from '$lib/controls/views/CommonControls.svelte';
  import BasePageInit from '$lib/page/views/BasePageInit.svelte';
  import type { PageServerData } from './$types';

  export let data: PageServerData;
  const { items } = data;
</script>

<BasePageInit title="Packages by Github stars" path="/statistics/github/stars" />
<CommonControls variant="translucent" />

<main>
  <Hero
    isFixed
    title="Trends on Github"
    titleSize="lg"
    subtitle="Packages by most stars"
    subtitleSize="xl"
    height="50"
    variant="prominent"
  />

  <SheetContent offset="50" class=" text-neutral-50 space-y-20 pb-60 bg-zinc-900">
    <Section withSpacingY withPaddingX class="mx-auto max-w-7xl space-y-10">
      <pre>
        {JSON.stringify(items, null, 2)}
      </pre>
      <table class="w-full">
        <tbody class="space-y-8">
          {#each items as { name }}
            <tr class="block">
              <td class="text-lg">{name}</td>
            </tr>
          {/each}
        </tbody>
      </table>
    </Section>
  </SheetContent>
</main>
