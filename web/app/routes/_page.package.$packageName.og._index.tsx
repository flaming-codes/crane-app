import { LoaderFunctionArgs } from "react-router";
import { composePackageOGImage } from "../modules/meta-og-image.server";
import { ENV } from "../data/env";
import { hoursToSeconds } from "date-fns";
import { packageNameSchema } from "../data/package.shape";
import { PackageService } from "../data/package.service";

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const { origin } = new URL(request.url);
  const { packageName } = params;

  const parsedId = packageNameSchema.safeParse(packageName);
  const exists = await PackageService.checkPackageExistsByName(
    parsedId.data || "",
  );

  if (parsedId.error || !exists) {
    throw new Response(null, {
      status: 400,
      statusText: "Valid package ID is required",
    });
  }

  const png = await composePackageOGImage({
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
          ? `public, immutable, no-transform, max-age=${hoursToSeconds(24 * 7)}`
          : "no-cache",
    },
  });
};
