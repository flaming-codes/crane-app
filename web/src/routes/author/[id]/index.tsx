import { component$ } from "@builder.io/qwik";
import { useLocation, type DocumentHead } from "@builder.io/qwik-city";
import { paneHeaderSpacing } from "~/modules/app/views/pane";
import { headingHeadline, headingSubline } from "~/modules/ui/views/heading";

export default component$(() => {
  const {
    params: { id },
  } = useLocation();
  return (
    <>
      <header class={paneHeaderSpacing()}>
        <h1 class={headingHeadline()}>{id}</h1>
        <p class={headingSubline()}>Author page</p>
      </header>
    </>
  );
});

export const head: DocumentHead = {
  title: "Author",
  meta: [
    {
      name: "description",
      content: "Author page description",
    },
  ],
};
