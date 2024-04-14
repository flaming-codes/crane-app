import { component$ } from "@builder.io/qwik";
import { Link } from "@builder.io/qwik-city";
import {
  TbBrandGithub,
  TbHome2,
  TbNews,
  TbSectionSign,
} from "@qwikest/icons/tablericons";

export const AppHead = component$(() => {
  return (
    <>
      <header class="flex items-center justify-between">
        <nav class="flex items-center gap-4">
          <Link href="/">
            <TbHome2 />
          </Link>
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
