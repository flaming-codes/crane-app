<script lang="ts">
  import SectionContent from './SectionContent.svelte';
</script>

<header
  class={`
    w-full sticky top-nav bg-opacity-20 backdrop-blur-md z-10
    lg:w-[clamp(380px,35vw,600px)] lg:h-full
  `}
>
  <SectionContent withPaddingLeft withPaddingX={false}>
    <h2 class="flex items-center text-3xl h-14 font-bold truncate">
      <slot />
    </h2>
  </SectionContent>
</header>
