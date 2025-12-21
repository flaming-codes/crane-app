import { composeIndexOGImage } from "../modules/meta-og-image.server";
import { ENV } from "../data/env";
import { minutesToSeconds } from "date-fns";
import { LoaderFunctionArgs } from "react-router";
import { PackageService } from "../data/package.service";
import { AuthorService } from "../data/author.service";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { origin } = new URL(request.url);

  const [packageRes, authorRes] = await Promise.allSettled([
    PackageService.getTotalPackagesCount(),
    AuthorService.getTotalAuthorsCount(),
  ]);

  const packageCount = packageRes.status === "fulfilled" ? packageRes.value : 0;
  const authorCount = authorRes.status === "fulfilled" ? authorRes.value : 0;
  const version = ENV.npm_package_version;

  const png = await composeIndexOGImage({
    requestUrl: origin,
    packageCount: Intl.NumberFormat().format(packageCount),
    authorCount: Intl.NumberFormat().format(authorCount),
    version,
  });

  // Respond with the PNG buffer
  return new Response(png as BodyInit, {
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
