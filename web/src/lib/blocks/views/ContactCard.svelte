<script lang="ts">
  import Link from '$lib/display/views/Link.svelte';
  import Iconic from './Iconic.svelte';

  export let name: string;
  export let img: { src: string; alt: string };
  export let socials: {
    email?: string;
    github?: string;
    linkedin?: string;
  };
</script>

<div class="border-l border-neutral-400 pl-3 space-y-8 max-w-md md:max-w-sm">
  <figure>
    <img src={img.src} alt={img.alt} class="w-[clamp(150px,20vw,200px)] mb-4" loading="lazy" />
    <figcaption class="text-xl font-mono text-neutral-50">{name}</figcaption>
  </figure>
  <p class="text-neutral-400 text-lg">
    <slot />
  </p>
  <div class="flex space-x-2">
    {#if socials.linkedin}
      <Link href={socials.linkedin} target="_blank" rel="noopener" ariaLabel="LinkedIn account URL">
        <Iconic name="carbon:logo-linkedin" size="32" />
      </Link>
    {/if}
    {#if socials.github}
      <Link href={socials.github} target="_blank" rel="noopener" ariaLabel="Email address">
        <Iconic name="carbon:logo-github" size="32" />
      </Link>
    {/if}
    {#if socials.email}
      <Link
        href={`mailto:${socials.email}`}
        target="_blank"
        rel="noopener"
        ariaLabel="Email address"
      >
        <Iconic name="carbon:email" size="32" />
      </Link>
    {/if}
  </div>
</div>
