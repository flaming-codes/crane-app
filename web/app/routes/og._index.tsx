import { composeIndexOGImage } from "../modules/meta-og-image.server";
import { ENV } from "../data/env";
import { minutesToSeconds } from "date-fns";
import { LoaderFunctionArgs } from "react-router";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { origin } = new URL(request.url);

  const png = await composeIndexOGImage({
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
          ? `public, immutable, no-transform, max-age=${minutesToSeconds(1)}`
          : "no-cache",
    },
  });
};
