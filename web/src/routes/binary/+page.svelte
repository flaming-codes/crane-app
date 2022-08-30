<script lang="ts">
  import Hero from '$lib/blocks/views/Hero.svelte';
  import Iconic from '$lib/blocks/views/Iconic.svelte';
  import Section from '$lib/blocks/views/Section.svelte';
  import SectionHeader from '$lib/blocks/views/SectionHeader.svelte';
  import SectionsColumn from '$lib/blocks/views/SectionsColumn.svelte';
  import SectionTitleSelect from '$lib/blocks/views/SectionTitleSelect.svelte';
  import SubGrid from '$lib/blocks/views/SubGrid.svelte';
  import SubGridItem from '$lib/blocks/views/SubGridItem.svelte';
  import ControlsBase from '$lib/controls/views/ControlsBase.svelte';
  import ControlsLink from '$lib/controls/views/ControlsLink.svelte';
  import SearchControls from '$lib/controls/views/SearchControls.svelte';
  import ColorScheme from '$lib/display/views/ColorScheme.svelte';
  import Link from '$lib/display/views/Link.svelte';
  import PackageDetailSection from '$lib/page/views/PackageDetailSection.svelte';
  import SearchInit from '$lib/search/views/SearchInit.svelte';
  import BaseMeta from '$lib/seo/views/BaseMeta.svelte';
  import Icon from '@iconify/svelte';

  const titles = ['Binaries', 'IDE'];
</script>

<BaseMeta title="Binary" path="/binary" />
<ColorScheme scheme="dark" />
<SearchInit />

{#await import('$lib/search/views/SearchInlinePanelResults.svelte') then Module}
  <Module.default isEnabled />
{/await}

<ControlsBase variant="dark">
  <SearchControls withTotal={false}>
    <svelte:fragment slot="links-start">
      <ControlsLink withGap href="/" title="Start">
        <Icon icon="carbon:switcher" />
      </ControlsLink>
    </svelte:fragment>
  </SearchControls>
</ControlsBase>

<main class="text-neutral-50 space-y-20 pb-60">
  <Hero title="R Binary" subtitle="Download the R binary" height="70" />

  <Section withTwoFoldLayout withPaddingX={false} id="binaries">
    <SectionHeader>
      <SectionTitleSelect selected="Binaries" options={titles} />
    </SectionHeader>

    <SectionsColumn>
      <PackageDetailSection title="Description">
        <div class="prose prose-invert max-w-none">
          <p>
            The R binary is a self-contained executable file that can be run on any computer with a
            supported operating system. It is the easiest way to get started with R.
          </p>
          <p>
            The R binary is available for Windows, macOS, and Linux. It is also available for
            Raspberry Pi.
          </p>
        </div>
        <SubGrid>
          <SubGridItem key="Current version">
            <span>4.2.1</span>
          </SubGridItem>
        </SubGrid>
      </PackageDetailSection>
      <PackageDetailSection title="Downloads">
        <SubGrid>
          <SubGridItem key="macOS (Apple Silicon)" withSpaceY="xs">
            <Link
              href="https://cran.r-project.org/bin/macosx/big-sur-arm64/base/R-4.2.1-arm64.pkg"
              ariaLabel="Download R for macOS (Apple Silicon)"
            >
              <Iconic name="carbon:download" />
            </Link>
          </SubGridItem>
          <SubGridItem key="macOS (Intel)" withSpaceY="xs">
            <Link
              href="https://cran.r-project.org/bin/macosx/base/R-4.2.1.pkg"
              ariaLabel="Download R for macOS (Intel)"
            >
              <Iconic name="carbon:download" />
            </Link>
          </SubGridItem>
          <SubGridItem key="Windows" withSpaceY="xs">
            <Link
              href="https://cran.r-project.org/bin/windows/base/R-4.2.1-win.exe"
              ariaLabel="Download R for Windows"
            >
              <Iconic name="carbon:download" />
            </Link>
          </SubGridItem>
          <SubGridItem key="Linux" withSpaceY="xs">
            <Link
              href="https://cran.r-project.org/bin/linux/"
              ariaLabel="Downloads for Linux"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Iconic name="carbon:arrow-up-right" />
            </Link>
          </SubGridItem>
        </SubGrid>
      </PackageDetailSection>
    </SectionsColumn>
  </Section>

  <Section withTwoFoldLayout withPaddingX={false} id="ide">
    <SectionHeader>
      <SectionTitleSelect selected="IDE" options={titles} />
    </SectionHeader>
    <SectionsColumn>
      <PackageDetailSection title="RStudio">
        <div class="prose prose-invert max-w-none">
          <p>
            RStudio is an integrated development environment (IDE) for R. It includes a console,
            syntax-highlighting editor that supports direct code execution, as well as tools for
            plotting, history, debugging and workspace management.
          </p>
        </div>
        <SubGrid>
          <SubGridItem key="Current version" withSpaceY="xs">
            <Link
              href="https://www.rstudio.com/"
              target="_blank"
              rel="noopener noreferrer"
              ariaLabel="RStudio link"
            >
              <Iconic name="carbon:arrow-up-right" />
            </Link>
          </SubGridItem>
        </SubGrid>
      </PackageDetailSection>
    </SectionsColumn>
  </Section>
</main>
