import { AuthorService } from "./author.service";
import { PackageService } from "./package.service";
import { BASE_URL } from "../modules/app";
import { slog } from "../modules/observability.server";
import type { Database } from "./supabase.types.generated";

export type PackageCombinedHit = {
  type: "package";
  name: string;
  synopsis: string | null;
  url: string;
  sources?: Array<
    [
      string,
      Database["public"]["Functions"]["match_package_embeddings"]["Returns"],
    ]
  >;
};

export type AuthorCombinedHit = {
  type: "author";
  name: string;
  id?: number;
  levenshtein_distance?: number;
  url: string;
};

export type CombinedSearchHit = PackageCombinedHit | AuthorCombinedHit;

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
    const withPackageUrl = (name: string) =>
      `${BASE_URL}/package/${encodeURIComponent(name)}`;
    const withAuthorUrl = (name: string) =>
      `${BASE_URL}/author/${encodeURIComponent(name)}`;

    const nonNull = <T>(item: T): item is NonNullable<T> => item != null;

    const packageCombined: PackageCombinedHit[] = packageHits.combined
      .filter(nonNull)
      .map((item) => ({
        type: "package" as const,
        name: item.name,
        synopsis: item.synopsis ?? null,
        url: withPackageUrl(item.name),
        sources: "sources" in item ? item.sources : undefined,
      }));

    const authorCombined: AuthorCombinedHit[] = authorHits.map((item) => ({
      type: "author" as const,
      name: item.name,
      id: item.id,
      levenshtein_distance: item.levenshtein_distance,
      url: withAuthorUrl(item.name),
    }));

    const getRelevanceRank = (hit: CombinedSearchHit) => {
      const nameLower = hit.name.toLowerCase();
      const synopsisLower =
        "synopsis" in hit && typeof hit.synopsis === "string"
          ? hit.synopsis.toLowerCase()
          : "";

      const exactMatch = nameLower === resortQuery;
      const startsWith = nameLower.startsWith(resortQuery);
      const includes =
        nameLower.includes(resortQuery) ||
        (synopsisLower ? synopsisLower.includes(resortQuery) : false);

      const levenshtein =
        "levenshtein_distance" in hit &&
        typeof hit.levenshtein_distance === "number"
          ? hit.levenshtein_distance
          : Number.POSITIVE_INFINITY;

      return [
        exactMatch ? 0 : 1,
        startsWith ? 0 : 1,
        includes ? 0 : 1,
        levenshtein,
      ] as const;
    };

    const combinedWithType: CombinedSearchHit[] = [
      ...packageCombined,
      ...authorCombined,
    ]
      .map((hit, idx) => ({
        hit,
        idx,
        rank: getRelevanceRank(hit),
      }))
      .sort((a, b) => {
        for (let i = 0; i < a.rank.length; i++) {
          if (a.rank[i] !== b.rank[i]) {
            return a.rank[i] - b.rank[i];
          }
        }
        return a.idx - b.idx;
      })
      .map(({ hit }) => hit);

    return {
      searchType: "universal" as const,
      query: normalizedQuery,
      combined: combinedWithType,
    };
  }
}
