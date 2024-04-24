import { component$ } from "@builder.io/qwik";
import { paneHeader } from "~/modules/app/views/pane";

export default component$(() => {
  return <div class={paneHeader()}>Welcome to CRAN/E</div>;
});
