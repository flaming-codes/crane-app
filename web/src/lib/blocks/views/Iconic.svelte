<script lang="ts">
  import Icon from '@iconify/svelte';

  export let name:
    | 'carbon:logo-github'
    | 'carbon:arrow-up-right'
    | 'carbon:piggy-bank-slot'
    | 'carbon:information'
    | 'carbon:keyboard'
    | 'carbon:ibm-cloud-pak-applications'
    | 'carbon:package'
    | 'carbon:download'
    | 'carbon:terminal'
    | 'carbon:cube'
    | 'carbon:checkmark'
    | 'carbon:email'
    | 'carbon:arrow-up-right'
    | 'carbon:close'
    | 'carbon:close-filled'
    | 'carbon:chevron-sort'
    | 'carbon:switcher'
    | 'carbon:data-view-alt'
    | 'carbon:repeat'
    | 'carbon:repeat-one'
    | 'carbon:search-locate'
    | 'carbon:search'
    | 'carbon:text-new-line'
    | 'carbon:help'
    | 'carbon:code'
    | 'raphael:commandline'
    | 'simple-icons:plausibleanalytics'
    | 'carbon:expand-categories'
    | 'carbon:chevron-down'
    | 'carbon:arrow-right'
    | 'carbon:user-profile'
    | 'la:orcid'
    | 'carbon:user-avatar'
    | 'carbon:logo-linkedin'
    | 'cib:windows'
    | 'file-icons:finder'
    | 'carbon:server-time'
    | 'carbon:document'
    | 'carbon:change-catalog'
    | 'carbon:license'
    | 'carbon:text-indent'
    | 'carbon:document-unknown'
    | 'carbon:cyclist'
    | 'carbon:swim'
    | 'carbon:chart-line'
    | 'carbon:star-filled'
    | 'carbon:user-avatar-filled-alt'
    | 'carbon:data-view-alt'
    | (string & {});
  export let size: '16' | '20' | '24' | '32' | '40' | '48' | '56' = '24';
  export let hFlip: boolean | undefined = undefined;

  let cn: string | undefined = undefined;
  export { cn as class };
</script>

<Icon icon={name} width={size} class={cn} {hFlip} />
