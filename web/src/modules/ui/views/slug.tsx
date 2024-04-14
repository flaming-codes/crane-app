import { component$ } from "@builder.io/qwik";
import { Link } from "@builder.io/qwik-city";

export const Slug = component$(() => {
  return (
    <div>
      <Link href="/" class="text-xs font-light tracking-wide">
        CRAN/E
      </Link>
    </div>
  );
});
