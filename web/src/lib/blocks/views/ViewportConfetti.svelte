<script lang="ts">
  import { Confetti } from 'svelte-confetti';
</script>

<div
  class="fixed -top-4 left-0 w-screen h-screen z-50 flex justify-center overflow-hidden pointer-events-none"
>
  <Confetti
    infinite
    x={[-5, 5]}
    y={[0, 0.1]}
    delay={[500, 2000]}
    duration="5000"
    amount="300"
    fallDistance="100vh"
  />
</div>
