import {
  ArticleSynopsis,
  composePressMeta,
  PressArticleHandle,
  ProminentArticleImage,
} from "../modules/press";
import { PageContentSection } from "../modules/page-content-section";
import { Separator } from "../modules/separator";
import { data, useLoaderData } from "react-router";
import { PageContent } from "../modules/page-content";
import { Header } from "../modules/header";
import { Anchors, AnchorLink } from "../modules/anchors";
import { Tag } from "../modules/tag";

export const loader = async () => {
  const DEMO_ARTICLE: PressArticleHandle = {
    slug: "crane-v2",
    title: "Announcing CRAN/E 2.0",
    subline: "A modernized search platform for the R community",
    createdAt: "2024-10-28",
    updatedAt: undefined,
    authors: ["CRAN/E Team"],
    type: "news",
    categories: ["announcement"],
    synopsisHTML:
      "CRAN/E, the <strong>Comprehensive R Archive Network / Enhanced</strong>, has officially launched version 2.0 today. This major release introduces a modernized design, significant usability enhancements, and an optimized site structure to facilitate easier searches, improved information retrieval, and an overall more intuitive experience.",
    sections: [
      {
        headline: "Fresh Coat",
        fragment: "fresh-coat",
        body: [
          {
            type: "html",
            value:
              "<p>We've introduced a new dark and light mode that lets users choose their preferred viewing experience. The color palette, powered by Radix colors, ensures a consistent and accessible experience across the board. Typography has been enhanced by using system fonts, providing a clean, native feel that adapts seamlessly to your device. The layout has also been revamped for improved readability and responsiveness, ensuring the content looks great across all devices.</p>",
          },

          {
            type: "image",
            value: {
              src: "/news/crane-v2-0.webp",
              caption: "Screenshot of the CRAN/E 2.0 start page in dark mode",
            },
          },
          {
            type: "image",
            value: {
              src: "/news/crane-v2-0-light.webp",
              caption: "Screenshot of the CRAN/E 2.0 start page in dark light",
            },
          },
          {
            type: "html",
            value:
              "<p>Additionally, we've optimized contrast levels in both modes to reduce eye strain, making long sessions more comfortable for users. The new design takes into account feedback from our user community, ensuring that accessibility standards are met, and that the user interface remains intuitive and straightforward. Our goal was not just to modernize the look but also to make sure the experience is inclusive for everyone, from newcomers to seasoned users.</p>",
          },
          {
            type: "image",
            value: {
              src: "/news/crane-v2-1.webp",
              caption: "Screenshot of the new search view",
            },
          },
        ],
      },
      {
        headline: "Compact Design",
        fragment: "compact-design",
        body: [
          {
            type: "html",
            value:
              "<p>One of our primary goals for this update was a more compact, efficient design. We've significantly reduced white space, allowing for much more information to be visible on each screen, especially for package detail pages. Despite the denser layout, we've ensured the interface remains easy to read and navigate, with a decluttered, streamlined look. By adopting system fonts, we've also made the site feel more familiar and native, laying a strong foundation for the years ahead.</p>",
          },
          {
            type: "image",
            value: {
              src: "/news/crane-v2-2.webp",
              caption: "Screenshot of the new package detail pag",
            },
          },
          {
            type: "html",
            value:
              "<p>The new compact design enhances productivity by presenting data more effectively without overwhelming users. We've implemented a card-based layout for key sections, which allows for quick scanning and easier content discovery. Package details are now grouped logically to facilitate faster access to critical information. Users can now quickly navigate through packages, dependencies, and release notes—all within a more unified and fluid experience.</p>",
          },
          {
            type: "image",
            value: {
              src: "/news/crane-v2-3.webp",
              caption: "Screenshot of the new author detail page",
            },
          },
        ],
      },
      {
        headline: "New Framework",
        fragment: "new-framework",
        body: [
          {
            type: "html",
            value:
              "<p>The transition from version 1 to version 2 also involved a major framework upgrade. We moved from SvelteKit to Remix, as SvelteKit, while functional, felt more akin to a templating engine rather than a comprehensive solution for our evolving needs. Remix, on the other hand, provides a robust, full-featured framework that simplifies the creation of more complex applications. CRAN/E remains a Progressive Web App (PWA) and continues to be fully Open Source, embracing the principles of transparency and community-driven development.</p>",
          },
          {
            type: "html",
            value:
              "<p>This new framework allows us to leverage advanced routing capabilities, enhancing the speed and performance of the site. Remix's built-in support for nested routes and optimized data fetching has enabled us to streamline interactions, significantly reducing load times and improving user experience. By choosing Remix, we are also better equipped to handle future scalability, ensuring that CRAN/E can grow alongside the expanding needs of the community.</p>",
          },
        ],
      },
      {
        headline: "Closing Words",
        fragment: "closing-words",
        body: [
          {
            type: "html",
            value:
              "<p>The release of CRAN/E 2.0 marks a significant milestone in our journey to provide a modern, efficient, and user-friendly platform for the R community. We've listened to your feedback and incorporated changes that not only improve the look and feel of the site but also enhance its functionality and accessibility. With a fresh design, a compact interface, and a new framework powering the experience, we believe CRAN/E is now better equipped to serve both current and future users.</p>",
          },
          {
            type: "html",
            value:
              "<p>We are excited about the road ahead and are committed to continuously improving CRAN/E based on the needs of our vibrant community. As always, we welcome your thoughts, suggestions, and contributions. Together, we can ensure that CRAN/E remains a valuable resource for R developers, researchers, and enthusiasts worldwide. Thank you for being part of this journey.</p>",
          },
        ],
      },
    ],
  };

  return data({
    article: DEMO_ARTICLE,
  });
};

export const meta = composePressMeta;

export default function NewsArticleCraneV2() {
  const { article } = useLoaderData<typeof loader>();

  const hasSections = article && article.sections.length > 0;

  return (
    <>
      <Header
        gradient="amethyst"
        headline={article?.title}
        subline={article?.subline}
        ornament={<Tag>{article.type}</Tag>}
      />

      {hasSections ? (
        <Anchors>
          {article.sections.map((section) => (
            <AnchorLink key={section.fragment} fragment={section.fragment}>
              {section.headline}
            </AnchorLink>
          ))}
        </Anchors>
      ) : null}

      <PageContent>
        <ArticleSynopsis
          createdAt={article.createdAt}
          updatedAt={article.updatedAt}
          authors={article.authors}
        >
          <p
            dangerouslySetInnerHTML={{
              __html: article.synopsisHTML,
            }}
          />
        </ArticleSynopsis>

        <Separator className="my-8" />

        {article.sections.map((section, index) => (
          <PageContentSection
            key={index}
            variant="prose"
            headline={section.headline}
            fragment={section.fragment}
          >
            {section.body.map((content, index) => {
              switch (content.type) {
                case "html":
                  return (
                    <div
                      key={index}
                      dangerouslySetInnerHTML={{
                        __html: content.value,
                      }}
                    />
                  );
                case "image":
                  return (
                    <ProminentArticleImage
                      key={index}
                      src={content.value.src}
                      caption={content.value.caption}
                    />
                  );
              }
            })}
          </PageContentSection>
        ))}

        <PageContentSection
          variant="prose"
          headline="Fresh Coat"
          fragment="fresh-coat"
        >
          <p>
            We&apos;ve introduced a new dark and light mode that lets users
            choose their preferred viewing experience. The color palette,
            powered by Radix colors, ensures a consistent and accessible
            experience across the board. Typography has been enhanced by using
            system fonts, providing a clean, native feel that adapts seamlessly
            to your device. The layout has also been revamped for improved
            readability and responsiveness, ensuring the content looks great
            across all devices.
          </p>
          <ProminentArticleImage
            src="/news/crane-v2-0.webp"
            caption="Screenshot of the CRAN/E 2.0 start page in dark mode"
          />
          <ProminentArticleImage
            src="/news/crane-v2-0-light.webp"
            caption="Screenshot of the CRAN/E 2.0 start page in dark light"
          />
          <p>
            Additionally, we&apos;ve optimized contrast levels in both modes to
            reduce eye strain, making long sessions more comfortable for users.
            The new design takes into account feedback from our user community,
            ensuring that accessibility standards are met, and that the user
            interface remains intuitive and straightforward. Our goal was not
            just to modernize the look but also to make sure the experience is
            inclusive for everyone, from newcomers to seasoned users.
          </p>
          <ProminentArticleImage
            src="/news/crane-v2-1.webp"
            caption="Screenshot of the new search view"
          />
        </PageContentSection>

        <PageContentSection
          variant="prose"
          headline="Compact Design"
          fragment="compact-design"
        >
          <p>
            One of our primary goals for this update was a more compact,
            efficient design. We&apos;ve significantly reduced white space,
            allowing for much more information to be visible on each screen,
            especially for package detail pages. Despite the denser layout,
            we&apos;ve ensured the interface remains easy to read and navigate,
            with a decluttered, streamlined look. By adopting system fonts,
            we&apos;ve also made the site feel more familiar and native, laying
            a strong foundation for the years ahead.
          </p>
          <ProminentArticleImage
            src="/news/crane-v2-2.webp"
            caption="Screenshot of the new package detail pag"
          />

          <p>
            The new compact design enhances productivity by presenting data more
            effectively without overwhelming users. We&apos;ve implemented a
            card-based layout for key sections, which allows for quick scanning
            and easier content discovery. Package details are now grouped
            logically to facilitate faster access to critical information. Users
            can now quickly navigate through packages, dependencies, and release
            notes—all within a more unified and fluid experience.
          </p>
          <ProminentArticleImage
            src="/news/crane-v2-3.webp"
            caption="Screenshot of the new author detail page"
          />
        </PageContentSection>

        <PageContentSection
          variant="prose"
          headline="New Framework"
          fragment="new-framework"
        >
          <p>
            The transition from version 1 to version 2 also involved a major
            framework upgrade. We moved from SvelteKit to Remix, as SvelteKit,
            while functional, felt more akin to a templating engine rather than
            a comprehensive solution for our evolving needs. Remix, on the other
            hand, provides a robust, full-featured framework that simplifies the
            creation of more complex applications. CRAN/E remains a Progressive
            Web App (PWA) and continues to be fully Open Source, embracing the
            principles of transparency and community-driven development.
          </p>
          <p>
            This new framework allows us to leverage advanced routing
            capabilities, enhancing the speed and performance of the site.
            Remix&apos;s built-in support for nested routes and optimized data
            fetching has enabled us to streamline interactions, significantly
            reducing load times and improving user experience. By choosing
            Remix, we are also better equipped to handle future scalability,
            ensuring that CRAN/E can grow alongside the expanding needs of the
            community.
          </p>
        </PageContentSection>

        <PageContentSection
          variant="prose"
          headline="Closing Words"
          fragment="closing-words"
        >
          <p>
            The release of CRAN/E 2.0 marks a significant milestone in our
            journey to provide a modern, efficient, and user-friendly platform
            for the R community. We&apos;ve listened to your feedback and
            incorporated changes that not only improve the look and feel of the
            site but also enhance its functionality and accessibility. With a
            fresh design, a compact interface, and a new framework powering the
            experience, we believe CRAN/E is now better equipped to serve both
            current and future users.
          </p>
          <p>
            We are excited about the road ahead and are committed to
            continuously improving CRAN/E based on the needs of our vibrant
            community. As always, we welcome your thoughts, suggestions, and
            contributions. Together, we can ensure that CRAN/E remains a
            valuable resource for R developers, researchers, and enthusiasts
            worldwide. Thank you for being part of this journey.
          </p>
        </PageContentSection>

        <p className="text-gray-dim mt-16 text-center text-sm lg:mt-32">
          Published on {article?.createdAt} by {article?.authors.join(", ")}
        </p>
      </PageContent>
    </>
  );
}
