<script lang="ts">
  import { store as notificationStore } from '$lib/notification/store/store';

  import Button from '$lib/display/views/Button.svelte';
  import { copyToClipboard } from '$lib/pwa/model/clipboard';
  import { shortcut } from '$lib/input/models/shortcut';
  import { platformString } from '$lib/pwa/model/text';
  import Iconic from '$lib/blocks/views/Iconic.svelte';
  import { sendEvent } from '$lib/analytics/model';

  export let value: string;

  const { queue } = notificationStore;

  const copy = () => {
    copyToClipboard(value, () => {
      notificationStore.push($queue, {
        type: 'success',
        value: platformString(`Copied {{${value}}}`),
        meta: {
          kbd: [platformString(':shift:'), platformString(':meta:'), 'C']
        }
      });
    });
    sendEvent('copy-to-clipboard', { props: { value } });
  };
</script>

<div
  aria-hidden
  class="invisible"
  use:shortcut={{
    control: true,
    shift: true,
    code: 'KeyC',
    callback: copy
  }}
/>

<Button readonly variant="highlight" withSpaceX="md" class="cursor-[copy]" on:click={copy}>
  <span>{value}</span>
  <Iconic name="carbon:copy" slot="icon" />
</Button>
