import type { MetaFunction } from "@remix-run/node";
import { cva } from "cva";

export const meta: MetaFunction = () => {
  return [
    { title: "CRAN/E" },
    { name: "description", content: "Welcome to CRAN/E" },
  ];
};

const twInput = cva({
  base: [
    "col-span-full text-3xl text-center bg-transparent py-4 transition-opacity duration-300 ease-in-out",
    "placeholder:text-center",
    "focus:outline-none focus:ring-0 focus:placeholder:opacity-50",
  ],
});

export default function Index() {
  return (
    <main className="h-full">
      <section className="grid grid-cols-6 w-[min(100%,600px)] place-content-center mx-auto h-full gap-16">
        <input
          type="text"
          className={twInput()}
          placeholder="Type to search packages..."
        />
      </section>
    </main>
  );
}
