import { ActionFunction } from "react-router";
import { AuthorService } from "../data/author.service";
import { PackageService } from "../data/package.service";
import { slog } from "../modules/observability.server";

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const intent = formData.get("intent");

  if (intent === "all") {
    const query = String(formData.get("q")).slice(0, 100);
    const normalizedQuery = query.trim().slice(0, 512);

    const [packages, authors] = await Promise.allSettled([
      PackageService.searchPackages(normalizedQuery),
      AuthorService.searchAuthors(normalizedQuery),
    ]);

    if (packages.status === "rejected") {
      slog.error("Failed to search packages", { error: packages.reason });
    }
    if (authors.status === "rejected") {
      slog.error("Failed to search authors", { error: authors.reason });
    }

    const packageHits =
      packages.status === "fulfilled"
        ? packages.value
        : {
            combined: [],
            lexical: [],
            semantic: [],
            isSemanticPreferred: false,
          };
    const authorHits = authors.status === "fulfilled" ? authors.value : [];

    // Re-sort the hits by 'includes' of name and synopsis
    const resortQuery = normalizedQuery.toLowerCase();
    const combined = [...packageHits.combined, ...authorHits].sort((a, b) => {
      const aIncludes =
        a &&
        (a.name.toLowerCase().includes(resortQuery) ||
          ("synopsis" in a && a.synopsis?.toLowerCase().includes(resortQuery)));
      const bIncludes =
        b &&
        (b.name.toLowerCase().includes(resortQuery) ||
          ("synopsis" in b && b.synopsis?.toLowerCase().includes(resortQuery)));

      if (aIncludes && !bIncludes) return -1;
      if (!aIncludes && bIncludes) return 1;
      return 0;
    });

    return Response.json({
      combined,
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
