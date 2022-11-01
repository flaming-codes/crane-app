<script lang="ts">
  import PlausibleStateButton from '$lib/analytics/views/PlausibleStateButton.svelte';
  import ContactCard from '$lib/blocks/views/ContactCard.svelte';
  import Hero from '$lib/blocks/views/Hero.svelte';
  import Iconic from '$lib/blocks/views/Iconic.svelte';
  import Section from '$lib/blocks/views/Section.svelte';
  import SectionHeader from '$lib/blocks/views/SectionHeader.svelte';
  import SectionsColumn from '$lib/blocks/views/SectionsColumn.svelte';
  import SectionTitleSelect from '$lib/blocks/views/SectionTitleSelect.svelte';
  import SheetContent from '$lib/blocks/views/SheetContent.svelte';
  import SubGrid from '$lib/blocks/views/SubGrid.svelte';
  import SubGridItem from '$lib/blocks/views/SubGridItem.svelte';
  import ControlsBase from '$lib/controls/views/ControlsBase.svelte';
  import ControlsLink from '$lib/controls/views/ControlsLink.svelte';
  import SearchControls from '$lib/controls/views/SearchControls.svelte';
  import ColorScheme from '$lib/display/views/ColorScheme.svelte';
  import Link from '$lib/display/views/Link.svelte';
  import LicensesList from '$lib/license/views/LicensesList.svelte';
  import PackageDetailSection from '$lib/page/views/PackageDetailSection.svelte';
  import SearchInit from '$lib/search/views/SearchInit.svelte';
  import BaseMeta from '$lib/seo/views/BaseMeta.svelte';
  import BreadcrumbMeta from '$lib/seo/views/BreadcrumbMeta.svelte';
  import type { PageData } from './$types';

  export let data: PageData;
  const { licenses = [] } = data;

  const titles = ['App', 'Team', 'Privacy', 'Source code', 'R Binaries', 'IDE', 'Legal'];
</script>

<BaseMeta title="About" path="/about" />
<BreadcrumbMeta items={[{ name: 'About', href: '/about' }]} />
<ColorScheme scheme="dark" />

<SearchInit />
{#await import('$lib/search/views/SearchInlinePanelResults.svelte') then Module}
  <Module.default isEnabled />
{/await}

<ControlsBase variant="black">
  <SearchControls withTotal={false}>
    <svelte:fragment slot="links-start">
      <ControlsLink withGap href="/" title="Latest packages">
        <Iconic name="carbon:switcher" size="16" />
      </ControlsLink>
    </svelte:fragment>
  </SearchControls>
</ControlsBase>

<main>
  <Hero
    isFixed
    title="About"
    subtitle="General information about CRAN/E"
    height="50"
    theme="dark"
  />

  <SheetContent offset="50" class="bg-zinc-900 text-neutral-50 space-y-20 pb-60">
    <!-- App -->

    <Section withTwoFoldLayout withPaddingX={false} id="app">
      <SectionHeader>
        <SectionTitleSelect selected="App" options={titles} />
      </SectionHeader>

      <SectionsColumn>
        <PackageDetailSection title="Mission">
          <div class="prose prose-lg prose-invert max-w-none">
            <p>
              <strong>CRAN/E</strong> is a modern PWA (Progressive Web App) that serves as a search
              engine and information display for packages hosted on CRAN. <strong>CRAN/E</strong>
              means <q>The Comprehensive R Archive Network, Enhanced</q>.
            </p>
            <p>
              None of our provided services host any of the packages. The only mission of this
              application is to make R-packages hosted on CRAN easier to find and better to read.
              <strong>CRAN/E</strong> services only store metadata associated to the packages for the
              purpose of searching and displaying information.
            </p>
          </div>
        </PackageDetailSection>
      </SectionsColumn>
    </Section>

    <!-- Us -->

    <Section withTwoFoldLayout withPaddingX={false} id="team">
      <SectionHeader>
        <SectionTitleSelect selected="Team" options={titles} />
      </SectionHeader>

      <SectionsColumn>
        <PackageDetailSection title="Introduction" withProse="dark">
          <div class="prose-lg">
            <p>
              Our names are Lukas and Tom and we're two developers from Austria. Our passion for
              coding (the one in R, the other in TypeScript) led us to the discovery of the original
              CRAN-site. Seeing the desparate visual state the site was in, we decided to give it a
              facelift. We're not affiliated with CRAN or RStudio in any way.
            </p>
            <p>
              <strong>CRAN/E</strong> is the culmination of our efforts to make the site more modern
              and user-friendly and we hope you enjoy it as much as we do! Our main focus was ease of
              use and accessibility, especially for lightning fast searches.
            </p>
          </div>
        </PackageDetailSection>

        <PackageDetailSection title="A band of brothers">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-x-20 gap-y-8">
            <ContactCard
              name="BSc Lukas Schönmann"
              img={{ src: '/images/we/lukas.webp', alt: 'Black and white portrait of Lukas' }}
              socials={{
                github: 'https://github.com/SpaceCowboy-71',
                linkedin: 'https://www.linkedin.com/in/lukas-schönmann-70781a215/'
              }}
            >
              I enjoy <Iconic name="carbon:cyclist" class="inline" size="20" /><span class="sr-only"
                >cycling</span
              >
              as often as I can, but also caring for my <Iconic
                name="carbon:agriculture-analytics"
                class="inline"
                size="20"
              /><span class="sr-only">plants</span> a lot. Also I'm the brother of Tom (the other guy).
            </ContactCard>
            <ContactCard
              name="Tom Schönmann"
              img={{ src: '/images/we/tom.webp', alt: 'Black and white portrait of Tom' }}
              socials={{
                github: 'https://github.com/flaming-codes',
                linkedin: 'https://www.linkedin.com/in/tom-schönmann-487b97164/'
              }}
            >
              There's nothing better than <Iconic
                name="carbon:swim"
                class="inline"
                size="20"
              /><span class="sr-only">swimming</span>
              , well, apart from <Iconic name="carbon:code" class="inline" size="20" /><span
                class="sr-only">coding</span
              > all day and night. Oh yes, and I'm the brother of Lukas.
            </ContactCard>
          </div>
        </PackageDetailSection>
      </SectionsColumn>
    </Section>

    <!-- Privacy -->

    <Section withTwoFoldLayout withPaddingX={false} id="privacy">
      <SectionHeader>
        <SectionTitleSelect selected={'Privacy'} options={titles} />
      </SectionHeader>

      <SectionsColumn>
        <PackageDetailSection title="Analytics" withProse="dark">
          <p>
            <strong>CRAN/E</strong> uses <Link
              href="https://plausible.io/"
              target="_blank"
              rel="noopener noreferrer">plausible.io</Link
            > for a privacy-friendly, non-invasive way to collect some basic usage data of this PWA.
            This analytics service is hosted in the EU and doesn't collect any personal identifiable
            data. This is also the reason why you don't see a cookie-banner - we simply don't need consent
            for data we never collect in the first place.
          </p>
          <p>
            You can opt-out of those basic analytics by clicking the button below. Please note that
            we only collect anonymous core web vitals data and no personal identifiable data. This
            means that we can't identify you in any way. Your opt-out will be stored in your
            browser's local storage.
            <PlausibleStateButton class="mt-4" />
          </p>

          <SubGrid class="not-prose">
            <SubGridItem key="Link" url="https://plausible.io">
              <div>plausible.io</div>
              <Link href="https://plausible.io" target="_blank" rel="noopener noreferrer">
                <Iconic name="simple-icons:plausibleanalytics" size="20" />
              </Link>
            </SubGridItem>
          </SubGrid>
        </PackageDetailSection>
      </SectionsColumn>
    </Section>

    <!-- Source code -->

    <Section withTwoFoldLayout withPaddingX={false} id="source code">
      <SectionHeader>
        <SectionTitleSelect selected="Source code" options={titles} />
      </SectionHeader>

      <SectionsColumn>
        <PackageDetailSection title="Github" withProse="dark">
          <div>
            <p>
              The source code for the <strong>CRAN/E</strong> frontend is available on Github as OSS
              (open source software). We believe in the power of open source and are happy to share our
              work with the community. For more details including the license, please visit the repository.
            </p>
            <p>
              If you want to contribute to the project, feel free to open a pull request or an issue
              on Github. We're always happy to hear from you!
            </p>
            <p>
              If you want to support us, you can do so by donating to our
              <Link
                href="https://buymeacoffee.com/v5728ggzwfI"
                target="_blank"
                rel="noopener noreferrer">BuyMeACoffee</Link
              >.
            </p>
          </div>

          <SubGrid class="not-prose">
            <SubGridItem key="Repo" withSpaceY="xs">
              <strong>CRAN/E</strong>
              <Link
                href="https://github.com/flaming-codes/crane-app"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Iconic name="carbon:logo-github" />
              </Link>
            </SubGridItem>
            <SubGridItem key="Sponsor" withSpaceY="xs">
              <span>Buy-me-a-coffee</span>
              <Link
                href="https://buymeacoffee.com/v5728ggzwfI"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Iconic name="carbon:piggy-bank-slot" />
              </Link>
            </SubGridItem>
          </SubGrid>
        </PackageDetailSection>
      </SectionsColumn>
    </Section>

    <!-- Binary -->

    <Section withTwoFoldLayout withPaddingX={false} id="r binaries">
      <SectionHeader>
        <SectionTitleSelect selected="R Binaries" options={titles} />
      </SectionHeader>

      <SectionsColumn>
        <PackageDetailSection title="Description">
          <div class="prose prose-invert max-w-none">
            <p>
              The R binary is a self-contained executable file that can be run on any computer with
              a supported operating system. It is the easiest way to get started with R.
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

    <!-- Legal -->

    <Section withTwoFoldLayout withPaddingX={false} id="legal">
      <SectionHeader>
        <SectionTitleSelect selected="Legal" options={titles} />
      </SectionHeader>

      <SectionsColumn>
        <PackageDetailSection title="Licenses">
          <div class="prose prose-invert max-w-none">
            <p>
              The following list contains all package dependencies of external code used by <strong
                >CRAN/E</strong
              >. Click each link to visit the respective source code page.
            </p>
          </div>
          <LicensesList {licenses} />
        </PackageDetailSection>
      </SectionsColumn>
    </Section>
  </SheetContent>
</main>
