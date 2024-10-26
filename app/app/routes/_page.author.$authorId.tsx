import { json, type LoaderFunction, type MetaFunction } from "@remix-run/node";
import { Header } from "../modules/header";
import { Tag } from "../modules/tag";
import { AnchorLink, Anchors } from "../modules/anchors";
import { PackageAuthor, Pkg } from "../data/types";
import { AuthorService } from "../data/author.service";
import { Link, useLoaderData } from "@remix-run/react";
import { PageContent } from "../modules/page-content";
import { PageContentSection } from "../modules/page-content-section";
import { Prose } from "../modules/prose";
import { Separator } from "../modules/separator";
import { InfoCard } from "../modules/info-card";
import { InfoPill } from "../modules/info-pill";

type AuthorRes = Awaited<ReturnType<typeof AuthorService.getAuthor>>;

const anchors = ["Synopsis", "Packages", "Team"] as const;

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
  const data = useLoaderData() as AuthorRes;
  const { authorId, otherAuthors, packages, description } = data;

  const countPackages = packages.length;
  const hasOtherAuthors = otherAuthors.length > 0;

  return (
    <>
      <Header
        gradient="jade"
        headline={authorId}
        subline={`Author of ${countPackages} CRAN ${countPackages === 1 ? "package" : "packages"}`}
        ornament={<Tag>CRAN Author</Tag>}
      />

      <Anchors>
        {anchors
          .filter((anchor) => {
            if (anchor === "Team" && !hasOtherAuthors) return false;
            return true;
          })
          .map((item) => (
            <AnchorLink key={item} fragment={`#${item.toLowerCase()}`}>
              {item}
            </AnchorLink>
          ))}
      </Anchors>

      <PageContent>
        <SynopsisSection description={description} />
        <Separator />
        <PackagesSection packages={packages} />
        {hasOtherAuthors ? (
          <>
            <Separator />
            <TeamSection otherAuthors={otherAuthors} />
          </>
        ) : null}
      </PageContent>
    </>
  );
}

function SynopsisSection(props: Pick<AuthorRes, "description">) {
  const { description } = props;

  return (
    <PageContentSection fragment="synopsis">
      <div className="space-y-6">
        <Prose html={description} />
      </div>
    </PageContentSection>
  );
}

function PackagesSection(props: Pick<AuthorRes, "packages">) {
  const { packages } = props;

  return (
    <PageContentSection headline="Packages" fragment="packages">
      <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 items-start">
        {packages.map((item) => (
          <li key={item.name}>
            <Link to={`/package/${item.slug}`}>
              <InfoCard variant="jade">
                <span className="flex flex-col gap-2">
                  <span className="text-xs text-gray-dim">{item.name}</span>
                  <span>{item.title}</span>
                </span>
              </InfoCard>
            </Link>
          </li>
        ))}
      </ul>
    </PageContentSection>
  );
}

function TeamSection(props: Pick<AuthorRes, "otherAuthors">) {
  const { otherAuthors } = props;

  return (
    <PageContentSection headline="Team" fragment="team">
      <ul className="flex flex-wrap gap-2 items-start">
        {otherAuthors.map((name) => (
          <li key={name}>
            <Link to={`/author/${name}`}>
              <InfoPill>{name}</InfoPill>
            </Link>
          </li>
        ))}
      </ul>
    </PageContentSection>
  );
}
