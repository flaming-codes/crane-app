<script lang="ts">
  import { store } from '$lib/search/stores/search';

  import Section from '$lib/blocks/views/Section.svelte';
  import SectionTitleSelect from '$lib/blocks/views/SectionTitleSelect.svelte';
  import ControlsBase from '$lib/controls/views/ControlsBase.svelte';
  import ControlsLink from '$lib/controls/views/ControlsLink.svelte';
  import SearchControls from '$lib/controls/views/SearchControls.svelte';
  import SectionHeader from '$lib/blocks/views/SectionHeader.svelte';
  import SectionSubHeader from '$lib/blocks/views/SectionSubHeader.svelte';
  import NotificationCenterAnchor from '$lib/notification/view/NotificationCenterAnchor.svelte';
  import SubGrid from '$lib/blocks/views/SubGrid.svelte';
  import SubGridItem from '$lib/blocks/views/SubGridItem.svelte';
  import CopyToClipboardButton from '$lib/package/views/CopyToClipboardButton.svelte';
  import SectionsColumn from '$lib/blocks/views/SectionsColumn.svelte';
  import SubGridIcon from '$lib/blocks/views/SubGridIcon.svelte';
  import PackageDocumentIcon from '$lib/package/views/PackageDocumentIcon.svelte';
  import SystemIcon from '$lib/blocks/views/SystemIcon.svelte';
  import PackageDetailSection from '$lib/page/views/PackageDetailSection.svelte';
  import ColorScheme from '$lib/display/views/ColorScheme.svelte';
  import BaseMeta from '$lib/seo/views/BaseMeta.svelte';
  import Link from '$lib/display/views/Link.svelte';
  import PackageDependencySubGrid from '$lib/package/views/PackageDependencySubGrid.svelte';
  import type { PageData } from './$types';
  import Iconic from '$lib/blocks/views/Iconic.svelte';
  import { browser } from '$app/environment';
  import BreadcrumbMeta from '$lib/seo/views/BreadcrumbMeta.svelte';
  import SearchInit from '$lib/search/views/SearchInit.svelte';
  import Hero from '$lib/blocks/views/Hero.svelte';
  import FaqMeta from '$lib/seo/views/FaqMeta.svelte';
  import { getCssVarRemToPixels } from '$lib/display/models/parse';
  // import { Disclosure, DisclosureButton, DisclosurePanel } from '@rgossiaux/svelte-headlessui';

  const { hits, input: searchInput } = store;
  const { items: searchItems } = hits;

  export let data: PageData;
  const { item, overviewTuples, maintainer, materials, aboutItems, contacts, downloads } = data;

  let y = 0;

  const getHeroScrollDelta = () => {
    const halfWindowHeight = browser ? window.innerHeight / 2 : 0;
    const baseControlsHeight = browser ? getCssVarRemToPixels('--base-controls-h-sm') : 0;
    return halfWindowHeight - baseControlsHeight;
  };

  $: isNavDark = ($searchItems.length && $searchInput) || y > getHeroScrollDelta();

  const titles = [
    'At a glance',
    'Statistics',
    'Team',
    'Documentation',
    'Downloads',
    'Dependencies' /* 'Readme', */
  ];

  const dependencyGroups = [
    ['Depends', 'depends'],
    ['Imports', 'imports'],
    ['Suggests', 'suggests'],
    ['Enhances', 'enhances'],
    ['LinkingTo', 'linkingto'],
    ['Reverse Depends', 'reverse_depends'],
    ['Reverse Imports', 'reverse_imports'],
    ['Reverse Suggests', 'reverse_suggests'],
    ['Reverse Enhances', 'reverse_enhances'],
    ['Reverse LinkingTo', 'reverse_linkingto']
  ] as const;
</script>

<BaseMeta
  title={item.name}
  description="R package for {item.title}"
  path="/package/{item.slug}"
  image={{
    url: `https://www.cran-e.com/api/package/${item.slug}/poster`,
    alt: `R package ${item.name} poster`
  }}
/>
<BreadcrumbMeta
  items={[
    { name: 'Packages', href: '/package' },
    { name: item.name, href: `/package/${item.slug}` }
  ]}
/>
<FaqMeta
  items={[
    {
      q: `What does the R-package '${item.name}' do?`,
      a: item.title
    },
    {
      q: `Who maintains ${item.name}?`,
      a: maintainer?.[1] || 'Unknown'
    },
    {
      q: `Who authored ${item.name}?`,
      a: item.author?.map((a) => a.name).join(', ') || 'Unknown'
    }
  ]}
/>
<ColorScheme scheme="dark" />
<NotificationCenterAnchor />

<SearchInit />
{#await import('$lib/search/views/SearchInlinePanelResults.svelte') then Module}
  <Module.default isEnabled />
{/await}

<svelte:window bind:scrollY={y} />

<ControlsBase variant={isNavDark ? 'black' : 'transparent'} class="text-black">
  <SearchControls withTotal={false} theme={isNavDark ? 'dark' : 'light'}>
    <svelte:fragment slot="links-start">
      <ControlsLink withGap href="/" title="Latest packages">
        <Iconic name="carbon:switcher" size="16" />
      </ControlsLink>
    </svelte:fragment>
  </SearchControls>
</ControlsBase>

<Hero
  isFixed
  title={item.name}
  subtitle={item.title}
  height="50!"
  variant="prominent"
  theme="gradient-stone"
  textVariant="dense"
/>

<main
  class={`
    absolute top-0 left-0 right-0 mt-[50vh] min-h-[200vh] pt-8 pb-20 space-y-8 bg-zinc-900 text-gray-100
  `}
>
  <Section withTwoFoldLayout withPaddingX={false} id="at a glance">
    <!-- At a glance -->

    <SectionHeader>
      <SectionTitleSelect selected="At a glance" options={titles} />
    </SectionHeader>

    <SectionsColumn>
      <PackageDetailSection title="Installation" id="installation">
        <div>
          <CopyToClipboardButton value="install.packages('{item.name}')" />
        </div>
      </PackageDetailSection>

      <PackageDetailSection title="About" id="about">
        <p class="prose prose-lg prose-invert max-w-none">
          {item.description}
        </p>
        <SubGrid>
          {#each aboutItems as [key, value, meta]}
            <SubGridItem
              withKeyTruncate
              withSpaceY="xs"
              withValueOverflow="hidden"
              key={key.replace('https://', '').replace('http://', '')}
              title={key}
              url={meta && 'url' in meta && meta.url}
            >
              {#if value}
                <span>{value}</span>
              {/if}
              {#if meta}
                <SubGridIcon {meta} />
              {/if}
            </SubGridItem>
          {/each}
        </SubGrid>
      </PackageDetailSection>

      <PackageDetailSection title="Key Metrics" id="key metrics">
        <SubGrid>
          {#each overviewTuples as [key, value, meta]}
            <SubGridItem {key}>
              <span>{value}</span>
              {#if meta}
                {#if !('text' in meta)}
                  <SubGridIcon {meta} />
                {:else if 'text' in meta}
                  <span class="block text-xs text-neutral-300">{meta.text}</span>
                {/if}
              {/if}
            </SubGridItem>
          {/each}
        </SubGrid>
      </PackageDetailSection>
    </SectionsColumn>
  </Section>

  <!-- Usage -->

  {#if downloads.length}
    <Section withTwoFoldLayout withPaddingX={false} id="statistics">
      <SectionHeader>
        <SectionTitleSelect selected="Statistics" options={titles} />
      </SectionHeader>

      <SectionsColumn>
        <PackageDetailSection title="Downloads" id="downloads">
          <SubGrid>
            {#each downloads as { value, label, trend }}
              <SubGridItem key={label}>
                <span>{value || '-'}</span>
                {#if trend}
                  <span class="flex items-center gap-x-1 text-xs text-neutral-300 mt-1">
                    {trend}
                    {#if trend.startsWith('-')}
                      <Iconic name="carbon:arrow-down" size="16" />
                    {/if}
                    {#if trend.startsWith('+')}
                      <Iconic name="carbon:arrow-up" size="16" />
                    {/if}
                  </span>
                {/if}
              </SubGridItem>
            {/each}
          </SubGrid>
        </PackageDetailSection>
      </SectionsColumn>
    </Section>
  {/if}

  <!-- Team -->

  <Section withTwoFoldLayout withPaddingX={false} id="team">
    <SectionHeader>
      <SectionTitleSelect selected="Team" options={titles} />
    </SectionHeader>

    <SectionsColumn>
      {#if maintainer}
        <PackageDetailSection title="Maintainer" id="maintainer">
          <SubGrid>
            {@const [key, value, meta] = maintainer}
            <SubGridItem {key} withValueSpaceY="md">
              <p>{value}</p>
              {#if meta}
                {#if 'mail' in meta}
                  <div class="text-xs text-neutral-300 font-mono">{meta.mail}</div>
                {/if}
                <div class="flex gap-x-3 pt-1">
                  <Link
                    withForcedReload
                    href="/author/{value}"
                    ariaLabel="All packages for {value}"
                    title="All packages for {value}"
                    class="text-white"
                  >
                    <Iconic name="carbon:user-profile" />
                  </Link>
                  <SubGridIcon {meta} />
                </div>
              {/if}
            </SubGridItem>
          </SubGrid>
        </PackageDetailSection>
      {/if}

      {#if item.author}
        <PackageDetailSection title="Authors" id="authors">
          <SubGrid>
            {#each item.author as { name, roles, link, extra }}
              <SubGridItem key={name} emphasis="value" withValueSpaceY="xs">
                {#if roles}
                  <p class="text-sm pt-1">{roles.join(' / ')}</p>
                {/if}
                {#if extra}
                  <p class="text-xs text-neutral-400 my-4 pt-1 w-full break-words">{extra}</p>
                {/if}
                <div class="flex gap-x-3 pt-1">
                  <Link
                    withForcedReload
                    href="/author/{name}"
                    ariaLabel="All packages for {name}"
                    title="All packages for {name}"
                    class="text-white"
                  >
                    <Iconic name="carbon:user-profile" />
                  </Link>
                  {#if link}
                    <Link
                      href={link}
                      ariaLabel="Link for {name}"
                      title="Link for {name}"
                      rel="noopener noreferrer"
                      target="_blank"
                      class="text-white"
                    >
                      <Iconic
                        name={link.startsWith('https://orcid.org/')
                          ? 'la:orcid'
                          : 'carbon:arrow-up-right'}
                      />
                    </Link>
                  {/if}
                </div>
              </SubGridItem>
            {/each}
          </SubGrid>
        </PackageDetailSection>
      {/if}

      {#if contacts}
        <PackageDetailSection title="Contacts" id="contacts">
          <SubGrid>
            {#each contacts as item}
              <SubGridItem key={item.name} emphasis="key">
                <Link href={'mailto:' + item.email} ariaLabel="Send email to {item.email}">
                  <Iconic name="carbon:email" />
                </Link>
              </SubGridItem>
            {/each}
          </SubGrid>
        </PackageDetailSection>
      {/if}
    </SectionsColumn>
  </Section>

  <!-- Documentation -->

  <Section withTwoFoldLayout withPaddingX={false} id="documentation">
    <SectionHeader>
      <SectionTitleSelect selected="Documentation" options={titles} />
    </SectionHeader>

    <SectionsColumn>
      {#if materials}
        <PackageDetailSection title="Material" id="material">
          <SubGrid>
            {#each materials as { name, link, type }}
              <SubGridItem key={name} withSpaceY="md">
                <Link
                  href={link}
                  rel={type !== 'download' ? 'noopener noreferrer' : undefined}
                  target={type !== 'download' ? '_blank' : undefined}
                  ariaLabel="Link to {name}"
                  class="block"
                >
                  <PackageDocumentIcon type={type || 'file'} />
                </Link>
              </SubGridItem>
            {/each}
          </SubGrid>
        </PackageDetailSection>
      {/if}

      {#if item.inviews}
        <PackageDetailSection title="In Views" id="in views">
          <SubGrid>
            {#each item.inviews as { name, link }}
              <SubGridItem key={name} withSpaceY="md">
                <Link
                  href={link}
                  rel="noopener noreferrer"
                  target="_blank"
                  class="block"
                  ariaLabel="Open inview to {link}"
                >
                  <Iconic name="carbon:data-view-alt" />
                </Link>
              </SubGridItem>
            {/each}
          </SubGrid>
        </PackageDetailSection>
      {/if}

      {#if item.additional_repositories}
        <PackageDetailSection title="Additional repos" id="additional repos">
          <SubGrid>
            {#if 'links' in item.additional_repositories}
              {#each item.additional_repositories.links as link}
                <SubGridItem withKeyTruncate key={link.replace('https://', '')} withSpaceY="md">
                  <Link
                    href={link}
                    rel="noopener noreferrer"
                    target="_blank"
                    class="block"
                    ariaLabel="Open repo repo"
                  >
                    <Iconic name="carbon:logo-github" />
                  </Link>
                </SubGridItem>
              {/each}
            {:else}
              {#each item.additional_repositories as { name, link }}
                <SubGridItem key={name} withSpaceY="md">
                  <Link
                    href={link}
                    rel="noopener noreferrer"
                    target="_blank"
                    class="block"
                    ariaLabel="Open repo {name}"
                  >
                    <Iconic name="carbon:logo-github" />
                  </Link>
                </SubGridItem>
              {/each}
            {/if}
          </SubGrid>
        </PackageDetailSection>
      {/if}

      {#if item.vignettes}
        <PackageDetailSection title="Vignettes" id="vignettes">
          <SubGrid>
            {#each item.vignettes as { name, link }}
              <SubGridItem key={name} withSpaceY="md">
                <Link
                  href={link}
                  rel="noopener noreferrer"
                  target="_blank"
                  ariaLabel="Vignette link to {name}"
                  class="block"
                >
                  <PackageDocumentIcon type="file" />
                </Link>
              </SubGridItem>
            {/each}
          </SubGrid>
        </PackageDetailSection>
      {/if}

      {#if item.classification_acm}
        <PackageDetailSection title="Classification ACM">
          <PackageDependencySubGrid items={item.classification_acm} emphasis="key" />
        </PackageDetailSection>
      {/if}

      {#if item.classification_msc}
        <PackageDetailSection title="Classification MSC">
          <PackageDependencySubGrid items={item.classification_msc} emphasis="key" />
        </PackageDetailSection>
      {/if}
    </SectionsColumn>
  </Section>

  <!-- Downloads -->

  <Section withTwoFoldLayout withPaddingX={false} id="downloads">
    <SectionHeader>
      <SectionTitleSelect selected="Downloads" options={titles} />
    </SectionHeader>

    <SectionsColumn>
      {#if item.macos_binaries && item.macos_binaries.length}
        <PackageDetailSection id="macos">
          <SectionSubHeader slot="title" class="space-x-4">
            <SystemIcon icon="macos" size="24" />
            <span>macOS</span>
          </SectionSubHeader>

          <SubGrid>
            {#each item.macos_binaries as { label, link, meta }}
              <SubGridItem key={label} withValueSpaceY="md">
                {#if meta}
                  <p>{meta}</p>
                {/if}
                <Link href={link} class="block" ariaLabel="Download binary for {label}">
                  <PackageDocumentIcon type="download" />
                </Link>
              </SubGridItem>
            {/each}
          </SubGrid>
        </PackageDetailSection>
      {/if}

      {#if item.windows_binaries && item.windows_binaries.length}
        <PackageDetailSection id="windows">
          <SectionSubHeader slot="title" class="space-x-4">
            <SystemIcon icon="windows" class="text-xs" size="24" />
            <span>Windows</span>
          </SectionSubHeader>
          <SubGrid>
            {#each item.windows_binaries as { label, link, meta }}
              <SubGridItem key={label} withValueSpaceY="md" withSpaceY="xs">
                {#if meta}
                  <p>{meta}</p>
                {/if}
                <Link href={link} class="block" ariaLabel="Download binary for {label}">
                  <PackageDocumentIcon type={meta === 'No binary' ? 'not-provided' : 'download'} />
                </Link>
              </SubGridItem>
            {/each}
          </SubGrid>
        </PackageDetailSection>
      {/if}

      {#if item.old_sources}
        <PackageDetailSection id="old sources">
          <SectionSubHeader slot="title" class="space-x-4">
            <SystemIcon icon="old" size="24" />
            <span>Old Sources</span>
          </SectionSubHeader>
          <SubGrid>
            <SubGridItem key={item.old_sources.label} withValueSpaceY="md" withSpaceY="xs">
              <Link
                href={item.old_sources.link}
                class="block"
                ariaLabel="Download binary for an old source"
              >
                <PackageDocumentIcon type="download" />
              </Link>
            </SubGridItem>
          </SubGrid>
        </PackageDetailSection>
      {/if}
    </SectionsColumn>
  </Section>

  <!-- Depdencies -->

  <Section withTwoFoldLayout withPaddingX={false} id="dependencies">
    <SectionHeader>
      <SectionTitleSelect selected="Dependencies" options={titles} />
    </SectionHeader>

    <SectionsColumn>
      {#each dependencyGroups as [title, key]}
        {#if item[key]}
          <PackageDetailSection {title}>
            <PackageDependencySubGrid items={item[key] || []} />
          </PackageDetailSection>
        {/if}
      {/each}
    </SectionsColumn>
  </Section>

  <!-- Readme -->

  <!--
<Section withTwoFoldLayout withPaddingX={false} id="readme">
    <SectionHeader>
      <SectionTitleSelect selected="Readme" options={titles} />
    </SectionHeader>

    <SectionsColumn>
      <Disclosure let:open>
        <PackageDetailSection>
          <SectionSubHeader slot="title" class="space-x-8">
            <span>Content</span>
            <DisclosureButton as="span">
              <Button withFlex size="sm" font="sans" withSpaceX="sm">
                <span>
                  {open ? 'Hide' : 'Show'}
                </span>
                <Icon
                  slot="icon"
                  icon={open ? 'carbon:chevron-up' : 'carbon:chevron-down'}
                  class="text-2xl"
                />
              </Button>
            </DisclosureButton>
          </SectionSubHeader>

          <DisclosurePanel>
            {#if open}
              <div class="prose max-w-none text-neutral-100">
                {#await import('$lib/blocks/views/DebugMarkdown.svelte') then Module}
                  <Module.default />
                {/await}
              </div>
            {/if}
          </DisclosurePanel>
        </PackageDetailSection>
      </Disclosure>
    </SectionsColumn>
  </Section>
  -->
</main>
