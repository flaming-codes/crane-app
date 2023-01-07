<script lang="ts">
  import Hero from '$lib/blocks/views/Hero.svelte';
  import Iconic from '$lib/blocks/views/Iconic.svelte';
  import Section from '$lib/blocks/views/Section.svelte';
  import SectionHeader from '$lib/blocks/views/SectionHeader.svelte';
  import SectionsColumn from '$lib/blocks/views/SectionsColumn.svelte';
  import SectionTitleSelect from '$lib/blocks/views/SectionTitleSelect.svelte';
  import SheetContent from '$lib/blocks/views/SheetContent.svelte';
  import SubGrid from '$lib/blocks/views/SubGrid.svelte';
  import SubGridItem from '$lib/blocks/views/SubGridItem.svelte';
  import CommonControls from '$lib/controls/views/CommonControls.svelte';
  import BasePageInit from '$lib/page/views/BasePageInit.svelte';
  import PackageDetailSection from '$lib/page/views/PackageDetailSection.svelte';

  const titles = ['Github'];
</script>

<BasePageInit title="Statistics" path="/statistic" />
<CommonControls variant="translucent" />

<main>
  <Hero
    isFixed
    title="Statistics"
    titleSize="lg"
    subtitle="General statistic about the R package ecosystem"
    height="50"
    theme="gradient-dark-zinc"
    variant="prominent"
  />

  <SheetContent offset="50" class=" text-neutral-50 space-y-20 pb-60 bg-zinc-900">
    <Section withTwoFoldLayout withPaddingX={false} withSpacingY id="usage">
      <SectionHeader>
        <SectionTitleSelect selected="Github" options={titles} />
      </SectionHeader>

      <SectionsColumn>
        <PackageDetailSection title="Github Stars">
          <SubGrid size="1">
            <SubGridItem
              withSpaceY="xs"
              withValueSpaceY="xs"
              key="Trending repos by stars"
              title="Trending repos by stars"
              url="/statistic/github/repos-by-stars/6h"
              emphasis="key"
              class="p-0"
            >
              <p>List of repositories with the most new stars within the selected period</p>
              <Iconic name="carbon:arrow-right" />
            </SubGridItem>
            <SubGridItem
              withSpaceY="xs"
              withValueSpaceY="xs"
              key="Trending users by followers"
              title="Trending users by followers"
              url="/statistic/github/users-by-followers/24h"
              emphasis="key"
              class="p-0"
            >
              <p>List of Github users with the most new followers within the selected period</p>
              <Iconic name="carbon:arrow-right" />
            </SubGridItem>
          </SubGrid>
        </PackageDetailSection>
      </SectionsColumn>
    </Section>
  </SheetContent>
</main>
