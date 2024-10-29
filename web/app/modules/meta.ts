import type { BreadcrumbList, FAQPage, WithContext } from "schema-dts";
import { BASE_URL } from "./app";
import type { MetaDescriptor, MetaFunction } from "@remix-run/node";

export const mergeMeta = (
  overrideFn: MetaFunction,
  appendFn?: MetaFunction,
): MetaFunction => {
  return (arg) => {
    // get meta from parent routes
    let mergedMeta = arg.matches.reduce((acc, match) => {
      return acc.concat(match.meta || []);
    }, [] as MetaDescriptor[]);

    // Dedupe meta by name, property, and title
    mergedMeta = mergedMeta.filter(
      (meta, index, self) =>
        index ===
        self.findIndex(
          (m) =>
            ("name" in meta && "name" in m && meta.name === m.name) ||
            ("property" in meta &&
              "property" in m &&
              meta.property === m.property) ||
            ("title" in meta && "title" in m && meta.title === m.title),
        ),
    );

    // replace any parent meta with the same name or property with the override
    const overrides = overrideFn(arg);

    for (const override of overrides) {
      const index = mergedMeta.findIndex(
        (meta) =>
          ("name" in meta &&
            "name" in override &&
            meta.name === override.name) ||
          ("property" in meta &&
            "property" in override &&
            meta.property === override.property) ||
          ("title" in meta && "title" in override),
      );
      if (index !== -1) {
        mergedMeta.splice(index, 1, override);
      } else {
        mergedMeta.push(override);
      }
    }

    // append any additional meta
    if (appendFn) {
      mergedMeta = mergedMeta.concat(appendFn(arg));
    }

    return mergedMeta;
  };
};

export function composeBreadcrumbsJsonLd(
  items: Array<{ name: string; href: string }>,
): WithContext<BreadcrumbList> {
  const baseItems = [
    {
      name: "Home",
      href: "/",
    },
  ] as const;

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [...baseItems, ...items].map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@id": BASE_URL + item.href,
        name: item.name,
      },
    })),
  };
}

export function composeFAQJsonLd(
  questions: Array<{ q: string; a: string }>,
): WithContext<FAQPage> {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: questions.map(({ q, a }) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: {
        "@type": "Answer",
        text: a,
      },
    })),
  };
}
