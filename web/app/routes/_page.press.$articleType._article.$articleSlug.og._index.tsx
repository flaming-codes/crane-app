import { LoaderFunctionArgs } from "react-router";
import { composePressArticleOGImage } from "../modules/meta-og-image.server";
import { ENV } from "../data/env";
import { hoursToSeconds } from "date-fns";
import { articleSlugSchema } from "../data/article.shape";
import { ArticleService } from "../data/article.service.server";

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const { origin, searchParams } = new URL(request.url);
  const { articleSlug, articleType = "" } = params;

  const parsedId = articleSlugSchema.safeParse(articleSlug);
  const exists = await ArticleService.checkNewsArticleExists(
    parsedId.data || "",
    articleType,
  );

  if (parsedId.error || !exists) {
    throw new Response(null, {
      status: 400,
      statusText: "Valid article slug is required",
    });
  }

  const headline = searchParams.get("headline");
  const subline = searchParams.get("subline") || undefined;
  if (!headline) {
    throw new Response(null, {
      status: 400,
      statusText: "Headline is required",
    });
  }

  const png = await composePressArticleOGImage({
    headline,
    subline,
    requestUrl: origin,
    articleType,
  });

  // Respond with the PNG buffer
  return new Response(png as BodyInit, {
    status: 200,
    headers: {
      "Content-Type": "image/png",
      "cache-control":
        ENV.NODE_ENV === "production"
          ? `public, immutable, no-transform, max-age=${hoursToSeconds(24 * 7)}`
          : "no-cache",
    },
  });
};
