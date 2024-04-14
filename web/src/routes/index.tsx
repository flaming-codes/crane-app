import { component$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { headingHeadline, headingSubline } from "~/modules/ui/views/heading";

export default component$(() => {
  return (
    <>
      <header>
        <h1 class={headingHeadline()}>xadmix</h1>

        <p class={headingSubline()}>
          Can't wait to see what you build with qwik!
          <br />
          Happy coding.
        </p>
      </header>
    </>
  );
});

export const head: DocumentHead = {
  title: "Welcome to Qwik",
  meta: [
    {
      name: "description",
      content: "Qwik site description",
    },
  ],
};
