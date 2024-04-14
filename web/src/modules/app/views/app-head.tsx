import { component$ } from "@builder.io/qwik";
import { Link } from "@builder.io/qwik-city";
import { TbBrandGithub } from "@qwikest/icons/tablericons";
import { Slug } from "~/modules/ui/views/slug";

export const AppHead = component$(() => {
  return (
    <>
      <header class="flex items-center justify-between">
        <Slug />
        <Link href="https://github.com">
          <TbBrandGithub />
        </Link>
      </header>
    </>
  );
});
