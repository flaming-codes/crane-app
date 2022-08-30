<script lang="ts">
  import Section from '$lib/blocks/views/Section.svelte';
  import SectionContent from '$lib/blocks/views/SectionContent.svelte';
  import SectionSubHeader from '$lib/blocks/views/SectionSubHeader.svelte';

  export let title: string | undefined = undefined;
  export let id: string | undefined = undefined;
  export let withProse: 'light' | 'dark' | undefined = undefined;
</script>

<Section {id} withSpacingY="xs" withPaddingX={false} maxWidth="xl">
  {#if title}
    <SectionSubHeader>{title}</SectionSubHeader>
  {/if}
  <slot name="title" />
  <SectionContent {withProse} withPaddingX="xs">
    <slot />
  </SectionContent>
</Section>
