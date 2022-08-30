<script lang="ts">
  import type { SubGridMeta } from '../types';
  import Link from '$lib/display/views/Link.svelte';
  import Iconic from './Iconic.svelte';

  export let meta: SubGridMeta;
</script>

{#if 'url' in meta}
  <Link
    href={meta.url}
    ariaLabel="Link to {meta.url}"
    target={meta.isExternal ? '_blank' : undefined}
    rel={meta.isExternal ? 'noopener noreferrer' : undefined}
  >
    <Iconic name={meta.icon || 'carbon:arrow-up-right'} />
  </Link>
{:else if 'mail' in meta}
  <Link href="mailto:{meta.mail}" class=" text-2xl" ariaLabel="Compose mail to {meta.mail}">
    <Iconic name="carbon:email" />
  </Link>
{:else if 'boolean' in meta}
  <Iconic name={meta.boolean ? 'carbon:checkmark' : 'carbon:close'} />
{/if}
