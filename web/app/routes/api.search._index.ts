import { ActionFunctionArgs, json } from "@remix-run/node";
import { namedAction } from "remix-utils/named-action";
import { AuthorService } from "../data/author.service";
import { PackageService } from "../data/package.service";

export async function action({ request }: ActionFunctionArgs) {
  return namedAction(request, {
    all: async () => {
      const data = await request.formData();
      const query = String(data.get("q")).slice(0, 100);

      const [packageHits, authorHits] = await Promise.all([
        PackageService.searchPackages(query),
        AuthorService.searchAuthors(query),
      ]);

      return json({
        packages: {
          hits: packageHits,
        },
        authors: {
          hits: authorHits,
        },
      });
    },
  });
}
