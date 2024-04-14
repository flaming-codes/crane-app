import { component$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";

export default component$(() => {
  return (
    <>
      <header class="flex items-center justify-between">Legal</header>
    </>
  );
});

export const head: DocumentHead = {
  title: "Legal",
  meta: [
    {
      name: "description",
      content: "Legal page description",
    },
  ],
};
