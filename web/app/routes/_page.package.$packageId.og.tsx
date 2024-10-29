import { LoaderFunctionArgs } from "@remix-run/node";
import { composePackageOGImage } from "../modules/meta-og-image.server";
import { ENV } from "../data/env";
import { addDays, getSeconds } from "date-fns";
import { packageSlugSchema } from "../data/package.shape";

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const { origin } = new URL(request.url);
  const { packageId } = params;

  const parsedId = packageSlugSchema.safeParse(packageId);
  if (parsedId.error) {
    throw new Response(null, {
      status: 400,
      statusText: "Valid package ID is required",
    });
  }

  const png = await composePackageOGImage({
    name: encodeURIComponent(parsedId.data),
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
          ? `public, immutable, no-transform, max-age=${getSeconds(addDays(new Date(), 365))}`
          : "no-cache",
    },
  });
};
