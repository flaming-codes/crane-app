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

  const titles = ['CRAN/E'];
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
    <Section withTwoFoldLayout withPaddingX={false} withSpacingY id="crane">
      <SectionHeader>
        <SectionTitleSelect selected="CRAN/E" options={titles} />
      </SectionHeader>
      <SectionsColumn>
        <PackageDetailSection title="CRAN/E trends">
          <SubGrid size="1">
            <SubGridItem
              withSpaceY="xs"
              withValueSpaceY="xs"
              key="Trending packages & authors"
              title="Trending packages & authors"
              url="/statistic/crane/page-visits"
              emphasis="key"
              class="p-0"
            >
              <p>List of packages and authors with the most page visits within the last 24h</p>
              <Iconic name="carbon:arrow-right" />
            </SubGridItem>
          </SubGrid>
        </PackageDetailSection>
      </SectionsColumn>
    </Section>
  </SheetContent>
</main>
