import { LoaderFunctionArgs } from "react-router";
import { composePressArticleOGImage } from "../modules/meta-og-image.server";
import { ENV } from "../data/env";
import { hoursToSeconds } from "date-fns";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { origin } = new URL(request.url);

  const png = await composePressArticleOGImage({
    headline: "CRAN/E Newsroom",
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
