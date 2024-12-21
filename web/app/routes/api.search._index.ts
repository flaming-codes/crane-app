import { ActionFunction } from "react-router";
import { AuthorService } from "../data/author.service";
import { PackageService } from "../data/package.service";

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const intent = formData.get("intent");

  if (intent === "all") {
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
  }

  throw new Error("Invalid intent");
};
