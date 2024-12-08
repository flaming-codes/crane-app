import { ActionFunction } from "@remix-run/node";
import { namedAction } from "remix-utils/named-action";
import { AuthorService } from "../data/author.service";
import { PackageService } from "../data/package.service";

export const action: ActionFunction = async ({ request }) => {
  return namedAction(request, {
    all: async () => {
      const formData = await request.formData();
      const query = String(formData.get("q")).slice(0, 100);

      const [packageHits, authorHits] = await Promise.all([
        PackageService.searchPackages(query),
        AuthorService.searchAuthors(query),
      ]);

      return Response.json({
        packages: {
          hits: packageHits,
        },
        authors: {
          hits: authorHits,
        },
      });
    },
  });
};
