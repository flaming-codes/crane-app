<!--
  Simple wrapper for the NotificationCenter to place
  it at the bottom of the screen.
-->
<script>
  import NotificationCenter from './NotificationCenter.svelte';
</script>

<div class="fixed bottom-0 left-0 right-0 h-nav z-10">
  <NotificationCenter />
</div>
