import { PageContent } from "../modules/page-content";
import { Header } from "../modules/header";
import { Outlet, useMatches } from "react-router";
import { Tag } from "../modules/tag";
import { findArticleMatch } from "../modules/article";
import { AnchorLink, Anchors } from "../modules/anchors";

export default function NewsArticlePage() {
  const matches = useMatches();
  const article = findArticleMatch(matches);

  const hasSections = article && article.sections.length > 0;

  return (
    <>
      <Header
        gradient="amethyst"
        headline={article?.title}
        subline={article?.subline}
        ornament={<Tag>News</Tag>}
      />

      {hasSections ? (
        <Anchors>
          {article!.sections.map((section) => (
            <AnchorLink key={section.fragment} fragment={section.fragment}>
              {section.name}
            </AnchorLink>
          ))}
        </Anchors>
      ) : null}

      <PageContent>
        <Outlet />

        <p className="text-gray-dim mt-16 text-center text-sm lg:mt-32">
          Published on {article?.createdAt} by {article?.authors.join(", ")}
        </p>
      </PageContent>
    </>
  );
}
