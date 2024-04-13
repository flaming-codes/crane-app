import { component$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";

export default component$(() => {
 return (
  <>
   <h1 class=" font-bold text-9xl">CRAN/E</h1>
   <p>
    Can't wait to see what you build with qwik!
    <br />
    Happy coding.
   </p>
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
