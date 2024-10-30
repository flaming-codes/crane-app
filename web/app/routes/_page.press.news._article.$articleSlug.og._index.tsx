import { LoaderFunctionArgs } from "@remix-run/node";
import { composeNewsArticleOGImage } from "../modules/meta-og-image.server";
import { ENV } from "../data/env";
import { addDays, getSeconds } from "date-fns";
import { articleSlugSchema } from "../data/article.shape";
import { ArticleService } from "../data/article.service.server";

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const { origin, searchParams } = new URL(request.url);
  const { articleSlug } = params;

  const parsedId = articleSlugSchema.safeParse(articleSlug);
  const exists = await ArticleService.checkNewsArticleExists(
    parsedId.data || "",
    origin,
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

  const png = await composeNewsArticleOGImage({
    headline,
    subline,
    requestUrl: origin,
  });

  // Respond with the PNG buffer
  return new Response(png, {
    status: 200,
    headers: {
      "Content-Type": "image/png",
      "cache-control":
        ENV.NODE_ENV === "production"
          ? `public, immutable, no-transform, max-age=${getSeconds(addDays(new Date(), 7))}`
          : "no-cache",
    },
  });
};
