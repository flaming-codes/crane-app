import { json, type LoaderFunction } from "@remix-run/node";
import { Header } from "../modules/header";
import { Tag } from "../modules/tag";
import { AnchorLink, Anchors } from "../modules/anchors";
import { AuthorService } from "../data/author.service";
import { Link, useLoaderData } from "@remix-run/react";
import { PageContent } from "../modules/page-content";
import { PageContentSection } from "../modules/page-content-section";
import { Prose } from "../modules/prose";
import { Separator } from "../modules/separator";
import { InfoCard } from "../modules/info-card";
import { InfoPill } from "../modules/info-pill";
import { uniqBy } from "es-toolkit";
import { RiArrowRightSLine } from "@remixicon/react";
import {
  composeBreadcrumbsJsonLd,
  composeFAQJsonLd,
  mergeMeta,
} from "../modules/meta";
import { BASE_URL } from "../modules/app";
import { hoursToSeconds } from "date-fns";
import { slog } from "../modules/observability.server";

type AuthorRes = Awaited<ReturnType<typeof AuthorService.getAuthor>>;

const anchors = ["Synopsis", "Packages", "Team"] as const;

export const meta = mergeMeta(
  (params) => {
    const data = params.data as AuthorRes;

    return [
      { title: `${data.authorId} | CRAN/E` },
      {
        name: "description",
        content: `All R packages created by ${data.authorId} for CRAN`,
      },
    ];
  },
  (params) => {
    const data = params.data as AuthorRes;
    const url = BASE_URL + `/author/${data.authorId}`;

    return [
      { property: "og:title", content: `${data.authorId} | CRAN/E` },
      {
        property: "og:description",
        content: `All R packages created by ${data.authorId} for CRAN`,
      },
      { property: "og:url", content: url },
      {
        "script:ld+json": composeBreadcrumbsJsonLd([
          {
            name: "Authors",
            href: "/author",
          },
          {
            name: data.authorId,
            href: `/author/${data.authorId}`,
          },
        ]),
      },
      {
        "script:ld+json": composeFAQJsonLd([
          {
            q: `Who is ${data.authorId}?`,
            a: `${data.authorId} is the author of ${data.packages.length} CRAN packages.`,
          },
          {
            q: `What packages has ${data.authorId} created?`,
            a: `${data.authorId} has created the following CRAN packages: ${data.packages
              .slice(5)
              .map((pkg) => pkg.name)
              .join(", ")}`,
          },
          {
            q: `Who else has worked with ${data.authorId}?`,
            a: `${data.authorId} has worked with the following authors: ${data.otherAuthors
              .slice(5)
              .join(", ")}`,
          },
        ]),
      },
    ];
  },
);

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
    item.packages = uniqBy(item.packages, (pkg) => pkg.name);
    item.otherAuthors = uniqBy(item.otherAuthors, (author) => author);
  } catch (error) {
    slog.error(error);
    throw new Response(null, {
      status: 404,
      statusText: `Author '${authorId}' not found`,
    });
  }

  return json(item, {
    headers: {
      "Cache-Control": `public, max-age=${hoursToSeconds(12)}`,
    },
  });
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
            <AnchorLink key={item} fragment={item.toLowerCase()}>
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
  const count = packages.length;

  return (
    <PageContentSection
      headline={`${count} ${count === 1 ? "Package" : "Packages"}`}
      fragment="packages"
    >
      <ul className="grid grid-cols-2 items-start gap-4 sm:grid-cols-3 md:grid-cols-4">
        {packages.map((item) => (
          <li key={item.name}>
            <Link to={`/package/${item.slug}`}>
              <InfoCard variant="iris" icon="internal" className="min-h-48">
                <span className="flex flex-col gap-2">
                  <span className="text-gray-dim text-xs">{item.name}</span>
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
      <ul className="flex flex-wrap items-start gap-2">
        {otherAuthors.map((name) => (
          <li key={name}>
            <Link to={`/author/${name}`}>
              <InfoPill variant="jade">
                {name} <RiArrowRightSLine size={16} className="text-gray-dim" />
              </InfoPill>
            </Link>
          </li>
        ))}
      </ul>
    </PageContentSection>
  );
}
