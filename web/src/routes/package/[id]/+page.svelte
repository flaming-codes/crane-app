<script lang="ts">
  import { store } from '$lib/search/stores/search';
  import {
    store as focusTrapStore,
    disableInteractionOnFocusEffect
  } from '$lib/search/stores/disable-interaction';

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
  // import { Disclosure, DisclosureButton, DisclosurePanel } from '@rgossiaux/svelte-headlessui';
  import PackageDetailSection from '$lib/page/views/PackageDetailSection.svelte';
  import clsx from 'clsx';
  import ColorScheme from '$lib/display/views/ColorScheme.svelte';
  import BaseMeta from '$lib/seo/views/BaseMeta.svelte';
  import Link from '$lib/display/views/Link.svelte';
  import {
    parseAboutItems,
    parseContacts,
    parseMaintainer,
    parseMaterials,
    parseOverviewTuples
  } from '$lib/package/models/parse';
  import PackageDependencySubGrid from '$lib/package/views/PackageDependencySubGrid.svelte';
  import type { PageData } from './$types';
  import Iconic from '$lib/blocks/views/Iconic.svelte';

  const { state, typeAheadState, isInputFocused } = store;
  const { isInteractionEnabled, isTrapped } = focusTrapStore;

  export let data: PageData;

  const { item } = data;

  $: {
    // For now, we're only using type ahead suggestions,
    // for the input on the package details page.
    if ($typeAheadState === 'ready') {
      $state = 'ready';
    }
  }

  $: {
    void $isInteractionEnabled;
    void $isTrapped;
    void $isInputFocused;
    disableInteractionOnFocusEffect();
  }

  const titles = [
    'At a glance',
    'Team',
    'Documentation',
    'Downloads',
    'Dependencies' /* 'Readme', */
  ];

  const overviewTuples = parseOverviewTuples(item);
  const maintainer = parseMaintainer(item);
  const materials = parseMaterials(item);
  const aboutItems = parseAboutItems(item);
  const contacts = parseContacts(item);
</script>

<BaseMeta title={item.name} description={item.title} path="/package/{item.slug}" />
<ColorScheme scheme="dark" />
<NotificationCenterAnchor />

{#await import('$lib/search/views/SearchInlinePanelResults.svelte') then Module}
  <Module.default isEnabled />
{/await}

<ControlsBase variant="dark">
  <SearchControls withTotal={false}>
    <svelte:fragment slot="links-start">
      <ControlsLink withGap href="/" title="Start">
        <Iconic name="carbon:switcher" size="16" />
      </ControlsLink>
    </svelte:fragment>
  </SearchControls>
</ControlsBase>

<section class="fixed top-0 w-full h-[50vh] bg-zinc-100 text-black">
  <div class="grid place-content-center h-full text-center px-[5vw]">
    <h1 class="text-[clamp(2.8rem,9vw,9rem)] font-bold break-all leading-none">{item.name}</h1>
    <h2 class="text-sm lg:text-lg opacity-60 text-center">
      {item.title}
    </h2>
  </div>
</section>

<main
  class={clsx(
    `
    absolute top-0 left-0 right-0 mt-[50vh] min-h-[200vh] pb-20 space-y-8 bg-zinc-900 text-gray-100
    md:space-y-12 
    lg:space-y-16
  `,
    {
      'pointer-events-none cursor-none': !$isInteractionEnabled
    }
  )}
>
  <Section withTwoFoldLayout withPaddingX={false} id="at a glance">
    <!-- At a glance -->

    <SectionHeader>
      <SectionTitleSelect selected="At a glance" options={titles} />
    </SectionHeader>

    <SectionsColumn>
      <PackageDetailSection title="Installation" id="installation">
        <CopyToClipboardButton value="install.packages('{item.name}')" />
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

      <PackageDetailSection title="About" id="about">
        <p class="prose prose-lg prose-invert max-w-none">
          {item.description}
        </p>
        <SubGrid>
          {#each aboutItems as [key, value, meta]}
            <SubGridItem withKeyTruncate withSpaceY="xs" {key}>
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
    </SectionsColumn>
  </Section>

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
            <SubGridItem {key}>
              <p>{value}</p>
              {#if meta}
                <SubGridIcon {meta} />
              {/if}
            </SubGridItem>
          </SubGrid>
        </PackageDetailSection>
      {/if}

      {#if item.author}
        <PackageDetailSection title="Authors" id="authors">
          <SubGrid>
            {#each item.author as { name, roles, link, extra }}
              <SubGridItem key={name} emphasis="key">
                {#if roles}
                  <p>{roles.join(' / ')}</p>
                {/if}
                {#if extra}
                  <p class="text-xs text-neutral-400 my-4">{extra}</p>
                {/if}
                {#if link}
                  <Link
                    href={link}
                    ariaLabel="Link for {name}"
                    rel="noopener noreferrer"
                    target="_blank"
                    class="text-white"
                  >
                    <Iconic name="carbon:arrow-up-right" />
                  </Link>
                {/if}
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
        <PackageDetailSection title="In Views" id="in views">
          <SubGrid>
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
            <SystemIcon icon="macos" width="26" />
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
            <SystemIcon icon="windows" class="text-xs" width="26" />
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
            <SystemIcon icon="old" width="26" />
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
      {#if item.depends}
        <PackageDetailSection title="Depends">
          <PackageDependencySubGrid items={item.depends} />
        </PackageDetailSection>
      {/if}
      {#if item.imports}
        <PackageDetailSection title="Imports">
          <PackageDependencySubGrid items={item.imports} />
        </PackageDetailSection>
      {/if}
      {#if item.suggests}
        <PackageDetailSection title="Suggests">
          <PackageDependencySubGrid items={item.suggests} />
        </PackageDetailSection>
      {/if}
      {#if item.enhances}
        <PackageDetailSection title="Enhances">
          <PackageDependencySubGrid items={item.enhances} />
        </PackageDetailSection>
      {/if}
      {#if item.linkingto}
        <PackageDetailSection title="Linking To">
          <PackageDependencySubGrid items={item.linkingto} />
        </PackageDetailSection>
      {/if}

      {#if item.reverse_depends}
        <PackageDetailSection title="Reverse Depends">
          <PackageDependencySubGrid items={item.reverse_depends} />
        </PackageDetailSection>
      {/if}
      {#if item.reverse_imports}
        <PackageDetailSection title="Reverse Imports">
          <PackageDependencySubGrid items={item.reverse_imports} />
        </PackageDetailSection>
      {/if}
      {#if item.reverse_suggests}
        <PackageDetailSection title="Reverse Suggests">
          <PackageDependencySubGrid items={item.reverse_suggests} />
        </PackageDetailSection>
      {/if}
      {#if item.reverse_enhances}
        <PackageDetailSection title="Reverse Enhances">
          <PackageDependencySubGrid items={item.reverse_enhances} />
        </PackageDetailSection>
      {/if}
      {#if item.reverse_linkingto}
        <PackageDetailSection title="Reverse Linking To">
          <PackageDependencySubGrid items={item.reverse_linkingto} />
        </PackageDetailSection>
      {/if}
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
