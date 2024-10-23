import type { MetaFunction } from "@remix-run/node";
import { useSearchParams } from "@remix-run/react";
import { cva } from "cva";

export const meta: MetaFunction = () => {
  return [
    { title: "CRAN/E" },
    { name: "description", content: "Welcome to CRAN/E" },
  ];
};

const twMain = cva({
  base: ["grid grid-cols-6 divide divide-green-7"],
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
    "bg-transparent text-9xl font-black w-full break-words inline-block",
    "placeholder:transition-opacity placeholder:duration-200 placeholder:ease-in-out",
    "focus:outline-none focus:ring-0 focus:placeholder:opacity-50",
  ],
});

export default function Index() {
  const [searchParams, setSearchParams] = useSearchParams();
  const search = searchParams.get("search") ?? "";

  return (
    <main className={twMain()}>
      <div className="col-span-full break-all">
        <input
          className={twInput()}
          placeholder="Type to search..."
          value={search}
          onChange={(e) => setSearchParams({ search: e.target.value })}
        />
      </div>
    </main>
  );
}
