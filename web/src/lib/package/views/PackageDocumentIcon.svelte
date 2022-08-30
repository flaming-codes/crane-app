<script lang="ts">
  import Icon from '@iconify/svelte';
  import clsx from 'clsx';

  export let type: string;

  let cn: string | undefined = undefined;
  export { cn as class };
</script>

<Icon
  icon={clsx({
    'carbon:document': type === 'file',
    'carbon:change-catalog': type === 'changelog',
    'carbon:license': type === 'license',
    'carbon:text-indent': type === 'citation',
    'carbon:download': type === 'download',
    'carbon:document-unknown': type === 'not-provided'
  })}
  class={clsx('text-3xl', cn)}
/>
