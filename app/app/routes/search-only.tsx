import { cva } from "cva";

const twMain = cva({
  base: ["h-full"],
  variants: {
    pattern: {
      dots: "pattern-dots pattern-gray-11 pattern-bg-transparent pattern-size-6 pattern-opacity-100",
    },
  },
  defaultVariants: {
    pattern: undefined,
  },
});

const twInput = cva({
  base: [
    "col-span-full text-2xl text-center bg-transparent py-4 tracking-wide",
    //"rounded-full bg-blacka-12",
    "placeholder:text-center placeholder:transition-opacity placeholder:duration-200 placeholder:ease-in-out",
    "focus:outline-none focus:ring-0 focus:placeholder:opacity-50",
  ],
});

export function SearchOnly() {
  return (
    <main className={twMain()}>
      <section className="grid grid-cols-6 w-[min(100%,600px)] place-content-center mx-auto h-full gap-16 ">
        <input
          type="text"
          className={twInput()}
          placeholder="Type to search packages..."
        />
      </section>
    </main>
  );
}
