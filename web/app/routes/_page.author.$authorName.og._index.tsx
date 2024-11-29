import { LoaderFunctionArgs } from "@remix-run/node";
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

  // Respond with the PNG buffer
  return new Response(png, {
    status: 200,
    headers: {
      // Tell the browser the response is an image
      "Content-Type": "image/png",
      // Tip: You might want to heavily cache the response in production
      "cache-control":
        ENV.NODE_ENV === "production"
          ? `public, immutable, no-transform, max-age=${hoursToSeconds(24 * 7)}`
          : "no-cache",
    },
  });
};
