<div
  class={`
    fixed bottom-0 left-0 right-0 h-[var(--base-controls-h-sm)] z-10 -translate-y-full
    md:-translate-y-0
  `}
>
  {#await import('$lib/notification/view/NotificationCenter.svelte') then Module}
    <Module.default />
  {/await}
</div>
