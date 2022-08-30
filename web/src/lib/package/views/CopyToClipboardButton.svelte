<script lang="ts">
  import { store as notificationStore } from '$lib/notification/store/store';

  import Button from '$lib/display/views/Button.svelte';
  import { copyToClipboard } from '$lib/pwa/model/clipboard';
  import Icon from '@iconify/svelte';
  import { shortcut } from '$lib/input/models/shortcut';
  import { platformString } from '$lib/pwa/model/text';

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

<Button readonly type="text" withSpaceX="md" on:click={copy}>
  <span>{value}</span>
  <Icon icon="carbon:copy" slot="icon" />
</Button>
