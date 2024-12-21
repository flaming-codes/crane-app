import { data, type LoaderFunction } from "react-router";
import { Header } from "../modules/header";
import { Tag } from "../modules/tag";
import { AnchorLink, Anchors } from "../modules/anchors";
import { AuthorService } from "../data/author.service";
import { Link, useLoaderData } from "react-router";
import { PageContent } from "../modules/page-content";
import { PageContentSection } from "../modules/page-content-section";
import { Prose } from "../modules/prose";
import { Separator } from "../modules/separator";
import { InfoCard } from "../modules/info-card";
import { InfoPill } from "../modules/info-pill";
import { RiArrowRightSLine } from "@remixicon/react";
import {
  composeBreadcrumbsJsonLd,
  composeFAQJsonLd,
  mergeMeta,
} from "../modules/meta";
import { BASE_URL } from "../modules/app";
import { hoursToSeconds } from "date-fns";
import { slog } from "../modules/observability.server";
import { IS_DEV } from "../modules/app.server";

type AuthorRes = Awaited<
  ReturnType<typeof AuthorService.getAuthorDetailsByName>
>;

const anchors = ["Synopsis", "Packages", "Team"] as const;

export const meta = mergeMeta(
  (params) => {
    const data = params.data as AuthorRes;

    if (!data) {
      return [];
    }

    const url = BASE_URL + `/author/${encodeURIComponent(data.authorName)}`;

    return [
      { title: `${data.authorName} | CRAN/E` },
      {
        name: "description",
        content: `All R packages created by ${data.authorName} for CRAN`,
      },
      {
        property: "og:image",
        content: `${url}/og`,
      },
      { property: "og:title", content: `${data.authorName} | CRAN/E` },
      {
        property: "og:description",
        content: `All R packages created by ${data.authorName} for CRAN`,
      },
      { property: "og:url", content: url },
    ];
  },
  (params) => {
    const data = params.data as AuthorRes;

    if (!data) {
      return [];
    }

    return [
      {
        "script:ld+json": composeBreadcrumbsJsonLd([
          {
            name: "Authors",
            href: "/author",
          },
          {
            name: data.authorName,
            href: `/author/${data.authorName}`,
          },
        ]),
      },
      {
        "script:ld+json": composeFAQJsonLd([
          {
            q: `Who is ${data.authorName}?`,
            a: `${data.authorName} is the author of ${data.packages.length} CRAN packages.`,
          },
          {
            q: `What packages has ${data.authorName} created?`,
            a: `${data.authorName} has created the following CRAN packages: ${data.packages
              .slice(5)
              .map((pkg) => pkg.package.name)
              .join(", ")}`,
          },
          {
            q: `Who else has worked with ${data.authorName}?`,
            a: `${data.authorName} has worked with the following authors: ${data.otherAuthors
              .slice(5)
              .join(", ")}`,
          },
        ]),
      },
    ];
  },
);

export const loader: LoaderFunction = async ({ params }) => {
  const { authorName } = params;

  if (!authorName) {
    throw new Response(null, {
      status: 400,
      statusText: "Valid author name is required",
    });
  }

  let item: AuthorRes;

  try {
    item = await AuthorService.getAuthorDetailsByName(authorName);
    if (!item) {
      throw new Error(`Author '${authorName}' not found`);
    }
  } catch (error) {
    slog.error(error);
    throw new Response(null, {
      status: 404,
      statusText: `Author '${authorName}' not found`,
    });
  }

  return data(item, {
    headers: {
      "Cache-Control": IS_DEV
        ? "max-age=0, s-maxage=0"
        : `public, max-age=${hoursToSeconds(12)}`,
    },
  });
};

export default function AuthorPage() {
  const data = useLoaderData() as NonNullable<AuthorRes>;

  const { authorName, otherAuthors, packages, description } = data;

  const countPackages = packages.length;
  const hasOtherAuthors = otherAuthors.length > 0;

  return (
    <>
      <Header
        gradient="jade"
        headline={authorName}
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

function SynopsisSection(props: Pick<NonNullable<AuthorRes>, "description">) {
  const { description } = props;

  return (
    <PageContentSection fragment="synopsis">
      <div className="space-y-6">
        <Prose html={description} />
      </div>
    </PageContentSection>
  );
}

function PackagesSection(props: Pick<NonNullable<AuthorRes>, "packages">) {
  const { packages } = props;
  const count = packages.length;

  return (
    <PageContentSection
      headline={`${count} ${count === 1 ? "Package" : "Packages"}`}
      fragment="packages"
    >
      <ul className="grid grid-cols-2 items-start gap-4 sm:grid-cols-3 md:grid-cols-4">
        {packages.map(({ package: item }) => (
          <li key={item.name}>
            <Link to={`/package/${item.name}`}>
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

function TeamSection(props: Pick<NonNullable<AuthorRes>, "otherAuthors">) {
  const { otherAuthors } = props;

  return (
    <PageContentSection headline="Team" fragment="team">
      <ul className="flex flex-wrap items-start gap-2">
        {otherAuthors.map((author) => (
          <li key={author?.name}>
            <Link to={`/author/${author?.name}`}>
              <InfoPill variant="jade">
                {author?.name}{" "}
                <RiArrowRightSLine size={16} className="text-gray-dim" />
              </InfoPill>
            </Link>
          </li>
        ))}
      </ul>
    </PageContentSection>
  );
}
