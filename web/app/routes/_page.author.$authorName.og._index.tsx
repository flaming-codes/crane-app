import { LoaderFunctionArgs } from "react-router";
import { composeAuthorOGImage } from "../modules/meta-og-image.server";
import { ENV } from "../data/env";
import { hoursToSeconds } from "date-fns";
import { AuthorService } from "../data/author.service";

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const { origin } = new URL(request.url);
  const { authorName = "" } = params;

  const exists = await AuthorService.checkAuthorExistsByName(authorName);
  if (!exists) {
    throw new Response(null, {
      status: 400,
      statusText: "Valid author ID is required",
    });
  }

  const png = await composeAuthorOGImage({
    name: authorName,
    requestUrl: origin,
  });

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
