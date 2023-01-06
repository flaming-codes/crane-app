<script lang="ts">
  import Iconic from '$lib/blocks/views/Iconic.svelte';
  import OpenGraphImage from '$lib/seo/views/OpenGraphImage.svelte';
  import { mapRangeToLabel } from '$lib/statistics/models/github';
  import type { PageData } from './$types';

  export let data: PageData;
  const { items, selectedRange } = data;

  const subtitle =
    items && items.length
      ? `By stars within last ${mapRangeToLabel(selectedRange)}`
      : `No trend yet available for last ${mapRangeToLabel(selectedRange)}`;
</script>

<OpenGraphImage
  title={`Trending R-code on GitHub`}
  {subtitle}
  titleSize="md"
  textVariant="fit"
  theme="gradient-dark-zinc"
>
  {#if items && items.length}
    <div class="flex items-center space-x-16 text-[clamp(1.2rem,3vw,1.8rem)] opacity-80">
      {#each items as item}
        <div class="flex flex-col items-center">
          <div class="flex items-center space-x-1">
            <span>
              {item.trend.stargazers_count > 0 ? '+' : ''}
              {item.trend.stargazers_count}
            </span>
            <Iconic name="carbon:star-filled" class="w-6 h-6" />
          </div>
          <div class="flex items-center gap-x-2">
            <img
              src={item.original.owner.avatar_url}
              class="w-7 h-7 rounded-full overflow-hidden"
              alt="Github avatar"
              loading="eager"
            />
            {item.original.name}
          </div>
        </div>
      {/each}
    </div>
  {/if}
</OpenGraphImage>
