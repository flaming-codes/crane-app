import { AuthorService } from "./author.service";
import { PackageService } from "./package.service";
import { BASE_URL } from "../modules/app";
import { slog } from "../modules/observability.server";
import type { Database } from "./supabase.types.generated";

const MAX_QUERY_LENGTH = 512;
const nonNull = <T>(item: T): item is NonNullable<T> => item != null;
const withPackageUrl = (name: string) =>
  `${BASE_URL}/package/${encodeURIComponent(name)}`;
const withAuthorUrl = (name: string) =>
  `${BASE_URL}/author/${encodeURIComponent(name)}`;

export type PackageCombinedHit = {
  type: "package";
  name: string;
  synopsis: string | null;
  title?: string | null;
  last_released_at?: string | null;
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

type PackageSearchCombinedHit = {
  name: string;
  synopsis: string | null;
  title?: string | null;
  last_released_at?: string | null;
  sources?: PackageCombinedHit["sources"];
};

export type RelatedPackageSeed = {
  name: string;
  synopsis: string | null;
  title: string | null;
  description: string | null;
  url: string;
};

export type RelatedPackageSearchResult = {
  searchType: "related-packages";
  query: string;
  relatedQuery: string;
  seed: RelatedPackageSeed | null;
  combined: PackageCombinedHit[];
  isSemanticPreferred: boolean;
};

export class SearchService {
  static async searchUniversal(query: string) {
    const normalizedQuery = query.trim().slice(0, MAX_QUERY_LENGTH);

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

    const packageCombined: PackageCombinedHit[] = packageHits.combined
      .filter(nonNull)
      .map((item) => ({
        type: "package" as const,
        name: item.name,
        synopsis: item.synopsis ?? null,
        title: item.title,
        last_released_at: item.last_released_at,
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

  static async searchRelatedPackages(
    query: string,
  ): Promise<RelatedPackageSearchResult> {
    const normalizedQuery = query.trim().slice(0, MAX_QUERY_LENGTH);
    try {
      const initialPackageSearch = await PackageService.searchPackages(
        normalizedQuery,
        { limit: 1 },
      );

      const isNonEmptyString = (part: unknown): part is string =>
        typeof part === "string" && part.trim().length > 0;
      const seedHit = initialPackageSearch.combined.find(nonNull);

      if (!seedHit) {
        return {
          searchType: "related-packages",
          query: normalizedQuery,
          relatedQuery: "",
          seed: null,
          combined: [],
          isSemanticPreferred: false,
        };
      }

      const seedPackageData = await PackageService.getPackageByName(
        seedHit.name,
      );
      const relatedQueryBase = [
        seedHit.title,
        seedPackageData?.title,
        seedPackageData?.description,
        seedPackageData?.synopsis,
      ]
        .filter(isNonEmptyString)
        .join(" ")
        .trim()
        .slice(0, MAX_QUERY_LENGTH);

      const hasValidRelatedQuery = relatedQueryBase.length > 0;
      const searchQuery = hasValidRelatedQuery
        ? relatedQueryBase
        : normalizedQuery;

      const relatedPackagesSearch =
        await PackageService.searchPackages(searchQuery);

      const hasSources = (
        hit: PackageSearchCombinedHit,
      ): hit is PackageSearchCombinedHit & {
        sources: NonNullable<PackageCombinedHit["sources"]>;
      } => hit.sources != null;

      const candidates: PackageSearchCombinedHit[] =
        relatedPackagesSearch.combined
          .filter(nonNull)
          .filter((item) => item.name !== seedHit.name)
          .map((item) => ({
            name: item.name,
            synopsis: item.synopsis ?? null,
            title: item.title,
            last_released_at: item.last_released_at,
            sources: Array.isArray(
              (item as { sources?: PackageCombinedHit["sources"] }).sources,
            )
              ? (item as { sources?: PackageCombinedHit["sources"] }).sources
              : undefined,
          }));

      const combined: PackageCombinedHit[] = candidates.map((candidate) => ({
        type: "package" as const,
        name: candidate.name,
        synopsis: candidate.synopsis ?? null,
        title: candidate.title,
        last_released_at: candidate.last_released_at,
        url: withPackageUrl(candidate.name),
        sources: hasSources(candidate) ? candidate.sources : undefined,
      }));

      const seed: RelatedPackageSeed = {
        name: seedHit.name,
        synopsis: seedHit.synopsis ?? null,
        title: seedPackageData?.title ?? seedHit.title ?? null,
        description: seedPackageData?.description ?? null,
        url: withPackageUrl(seedHit.name),
      };

      return {
        searchType: "related-packages",
        query: normalizedQuery,
        relatedQuery: searchQuery,
        seed,
        combined,
        isSemanticPreferred: relatedPackagesSearch.isSemanticPreferred,
      };
    } catch (error) {
      slog.error("Failed to search related packages", {
        error,
        query: normalizedQuery,
      });
      return {
        searchType: "related-packages",
        query: normalizedQuery,
        relatedQuery: "",
        seed: null,
        combined: [],
        isSemanticPreferred: false,
      };
    }
  }
}
