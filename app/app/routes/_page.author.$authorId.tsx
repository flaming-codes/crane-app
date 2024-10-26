import { json, type LoaderFunction, type MetaFunction } from "@remix-run/node";
import { Header } from "../modules/header";
import { Tag } from "../modules/tag";
import { AnchorLink, Anchors } from "../modules/anchors";
import { PackageAuthor } from "../data/types";
import { AuthorService } from "../data/author.service";
import { useLoaderData } from "@remix-run/react";

type AuthorRes = Awaited<ReturnType<typeof AuthorService.getAuthor>>;

export const meta: MetaFunction = () => {
  return [
    { title: "CRAN/E" },
    { name: "description", content: "<Author> to CRAN/E" },
  ];
};

export const loader: LoaderFunction = async ({ params }) => {
  const { authorId } = params;

  if (!authorId) {
    throw new Response(null, {
      status: 400,
      statusText: "Author ID is required",
    });
  }

  let item: AuthorRes;

  try {
    item = await AuthorService.getAuthor(authorId);
    if (!item) {
      throw new Error(`Author '${authorId}' not found`);
    }
  } catch (error) {
    throw new Response(null, {
      status: 404,
      statusText: `Author '${authorId}' not found`,
    });
  }

  return json(item);
};

export default function AuthorPage() {
  const { authorId, otherAuthors, packages } = useLoaderData<AuthorRes>();

  const countPackages = packages.length;

  return (
    <>
      <Header
        gradient="slate"
        headline={authorId}
        subline={`Author of ${countPackages} ${countPackages === 1 ? "package" : "packages"}`}
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
