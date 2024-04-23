import { component$ } from "@builder.io/qwik";
import { Link } from "@builder.io/qwik-city";
import {
  TbBrandGithub,
  TbNews,
  TbSectionSign,
} from "@qwikest/icons/tablericons";
import SineLogo from "~/resources/sine-logo.svg?component";

export const AppHead = component$(() => {
  return (
    <>
      <header class="flex items-center justify-between">
        <nav class="flex flex-1 items-center gap-4 ">
          <div class="flex-1">
            <Link href="/">
              <SineLogo class="h-2 text-mauve-11" />
            </Link>
          </div>
          <Link href="/blog">
            <TbNews />
          </Link>
          <Link href="/legal">
            <TbSectionSign />
          </Link>
          <a href="https://github.com">
            <TbBrandGithub />
          </a>
        </nav>
      </header>
    </>
  );
});
