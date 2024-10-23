import type { LoaderFunction, MetaFunction } from "@remix-run/node";
import { Header } from "../modules/header";
import { Tag } from "../modules/tag";
import { AnchorLink, Anchors } from "../modules/anchors";

export const meta: MetaFunction = () => {
  return [
    { title: "CRAN/E" },
    { name: "description", content: "<Author> to CRAN/E" },
  ];
};

export const loader: LoaderFunction = async () => {
  return { props: {} };
};

export default function AuthorPage() {
  return (
    <>
      <Header
        gradient="slate"
        headline="Peter Li"
        subline="Author of 5 R packages"
        ornament={<Tag>CRAN Author</Tag>}
      />

      <Anchors>
        {["Synopsis", "Packages", "Team"].map((item) => (
          <AnchorLink key={item} fragment={`#${item.toLowerCase()}`}>
            {item}
          </AnchorLink>
        ))}
      </Anchors>
    </>
  );
}
