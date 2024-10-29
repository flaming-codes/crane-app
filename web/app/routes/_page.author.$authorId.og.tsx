import { LoaderFunctionArgs } from "@remix-run/node";
import { composeAuthorOGImage } from "../modules/meta-og-image.server";
import { ENV } from "../data/env";
import { addDays, getSeconds } from "date-fns";
import { authorSlugSchema } from "../data/author.shape";

export const OG_IMAGE_WIDTH = 1200;
export const OG_IMAGE_HEIGHT = 630;

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const { origin } = new URL(request.url);
  const { authorId } = params;

  const parsedId = authorSlugSchema.safeParse(authorId);
  if (parsedId.error) {
    throw new Response(null, {
      status: 400,
      statusText: "Valid author ID is required",
    });
  }

  const png = await composeAuthorOGImage({
    name: parsedId.data,
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
