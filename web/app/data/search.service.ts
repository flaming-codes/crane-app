import { AuthorService } from "./author.service";
import { PackageService } from "./package.service";
import { BASE_URL } from "../modules/app";
import { slog } from "../modules/observability.server";

export class SearchService {
  static async searchUniversal(query: string) {
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

    const withPackageUrl = (name: string) =>
      `${BASE_URL}/package/${encodeURIComponent(name)}`;
    const withAuthorUrl = (name: string) =>
      `${BASE_URL}/author/${encodeURIComponent(name)}`;

    const nonNull = <T>(item: T): item is NonNullable<T> => item != null;

    return {
      combined: combined.filter(nonNull).map((item) => {
        if ("synopsis" in item) {
          return {
            ...item,
            url: withPackageUrl(item.name),
          };
        }
        return {
          ...item,
          url: withAuthorUrl(item.name),
        };
      }),
      packages: {
        hits: {
          ...packageHits,
          combined: packageHits.combined.filter(nonNull).map((item) => ({
            ...item,
            url: withPackageUrl(item.name),
          })),
        },
      },
      authors: {
        hits: authorHits.filter(nonNull).map((item) => ({
          ...item,
          url: withAuthorUrl(item.name),
        })),
      },
    };
  }
}
