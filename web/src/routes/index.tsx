import { component$ } from "@builder.io/qwik";
import { paneHeaderSpacing } from "~/modules/app/views/pane";

export default component$(() => {
  return <div class={paneHeaderSpacing()}>Welcome to CRAN/E</div>;
});
