<script lang="ts">
  import Iconic from '$lib/blocks/views/Iconic.svelte';
  import clsx from 'clsx';

  export let type: string;

  let cn: string | undefined = undefined;
  export { cn as class };
</script>

<Iconic
  name={clsx({
    'carbon:document': type === 'file',
    'carbon:change-catalog': type === 'changelog',
    'carbon:license': type === 'license',
    'carbon:text-indent': type === 'citation',
    'carbon:download': type === 'download',
    'carbon:document-unknown': type === 'not-provided'
  })}
  class={clsx('text-3xl', cn)}
/>
