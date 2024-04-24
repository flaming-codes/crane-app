import { component$ } from "@builder.io/qwik";
import { Link } from "@builder.io/qwik-city";
import {
  TbBrandGithub,
  TbNews,
  TbSectionSign,
} from "@qwikest/icons/tablericons";
import { cva } from "cva";
import SineLogo from "~/resources/sine-logo.svg?component";

const item = cva({
  base: "px-2 py-1",
});

const header = cva({
  base: "-mt-2 flex items-center justify-between",
});

type Props = {
  class?: string;
};

export const AppHead = component$<Props>((props) => {
  const { class: cn } = props;

  return (
    <>
      <header class={header({ class: cn })}>
        <nav class="flex flex-1 items-center gap-1 ">
          <div class="flex-1">
            <Link href="/" class={item()}>
              <SineLogo class="h-2 text-mauve-11" />
            </Link>
          </div>
          <Link href="/blog" class={item()}>
            <TbNews />
          </Link>
          <Link href="/legal" class={item()}>
            <TbSectionSign />
          </Link>
          <a href="https://github.com" class={item()}>
            <TbBrandGithub />
          </a>
        </nav>
      </header>
    </>
  );
});
