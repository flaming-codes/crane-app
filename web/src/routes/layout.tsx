import { component$, Slot } from "@builder.io/qwik";
import { type RequestHandler } from "@builder.io/qwik-city";
import { pane, paneHeaderSpacing } from "~/modules/app/views/pane";
import { AppHead } from "~/modules/app/views/app-head";
import { Command } from "~/modules/command/views/command";

export const onGet: RequestHandler = async ({ cacheControl }) => {
  // Control caching for this request for best performance and to reduce hosting costs:
  // https://qwik.dev/docs/caching/
  cacheControl({
    // Always serve a cached response by default, up to a week stale
    staleWhileRevalidate: 60 * 60 * 24 * 7,
    // Max once every 5 seconds, revalidate on the server to get a fresh version of this page
    maxAge: 5,
  });
};

export default component$(() => {
  return (
    <div class="grid h-full grid-cols-1 md:grid-cols-2 lg:grid-cols-[1fr_1.6fr]">
      <section class={pane({ kind: "primary" })}>
        <AppHead />

        <Command class={paneHeaderSpacing({ offset: "header" })} />
      </section>
      <main class={pane({ kind: "secondary" })}>
        <Slot />
      </main>
    </div>
  );
});
