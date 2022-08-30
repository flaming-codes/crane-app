<script lang="ts">
  import ContactCard from '$lib/blocks/views/ContactCard.svelte';
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
  import LicensesList from '$lib/license/views/LicensesList.svelte';
  import PackageDetailSection from '$lib/page/views/PackageDetailSection.svelte';
  import SearchInit from '$lib/search/views/SearchInit.svelte';
  import BaseMeta from '$lib/seo/views/BaseMeta.svelte';
  import Icon from '@iconify/svelte';
  import type { PageData } from './$types';

  export let data: PageData;
  $: ({ licenses } = data);

  const titles = ['App', 'Team', 'Privacy', 'Source code', 'Legal'];
</script>

<BaseMeta title="About" path="/about" />
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
  <Hero title="About" subtitle="General information about CRAN/E" height="50" theme="dark" />

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
            <strong>CRAN/E</strong> services only store metadata associated to the packages for the purpose
            of searching and displaying information.
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
            <strong>CRAN/E</strong> is the culmination of our efforts to make the site more modern and
            user-friendly and we hope you enjoy it as much as we do! Our main focus was ease of use and
            accessibility, especially for lightning fast searches.
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
            I enjoy <Icon icon="carbon:cyclist" class="inline" height="20" /><span class="sr-only"
              >cycling</span
            >
            as often as I can, but also caring for my <Icon
              icon="carbon:agriculture-analytics"
              class="inline"
              height="20"
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
            There's nothing better than <Icon icon="carbon:swim" class="inline" height="20" /><span
              class="sr-only">swimming</span
            >
            , well, apart from <Icon icon="carbon:code" class="inline" height="20" /><span
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
            href="https://microanalytics.io"
            target="_blank"
            rel="noopener noreferrer">microanalytics.io</Link
          > for a privacy-friendly, non-invasive way to collect some basic usage data of this PWA. This
          analytics service is hosted in the EU and doesn't collect and personal identifiable data. This
          is also the reason why you don't see a cookie-banner - we simply don't need consent for data
          we never collect in the first place.
        </p>

        <SubGrid class="not-prose">
          <SubGridItem key="Link">
            <span>microanalytics.io</span>
            <Link href="https://microanalytics.io" target="_blank" rel="noopener noreferrer">
              <Iconic name="carbon:arrow-up-right" />
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
            The source code for the <strong>CRAN/E</strong> frontend is available on Github as OSS (open
            source software). We believe in the power of open source and are happy to share our work
            with the community. For more details including the license, please visit the repository.
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
              href="https://github.com/flaming-codes/crane"
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
</main>
