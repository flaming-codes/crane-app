import { PackageService } from "../data/package.service";
import { BASE_URL } from "../modules/app";
import { Tables } from "../data/supabase.types.generated";
import { CranDownloadsResponse } from "../data/package-insight.shape";

/**
 * Type definition for enriched package data returned by the enrichment function.
 * Uses database types to avoid duplication and drift.
 */
export type EnrichedPackageData = Pick<
  Tables<"cran_packages">,
  | "name"
  | "title"
  | "description"
  | "synopsis"
  | "version"
  | "licenses"
  | "needs_compilation"
  | "r_version"
  | "last_released_at"
> & {
  url: string;
  lastRelease: string;
  authors: Array<Pick<Tables<"authors">, "name"> & { url: string }>;
  maintainer: (Pick<Tables<"authors">, "name"> & { url: string }) | null;
  relations: Record<string, unknown>;
  statistics: {
    downloads: {
      lastMonth: number;
      lastYear: number;
      history: CranDownloadsResponse;
    };
    isTrending: boolean;
  };
};

/**
 * Enriches a list of package names with detailed metadata.
 * This follows the DRY principle by extracting the enrichment logic
 * used by both the MCP server search tools.
 *
 * @param packageNames - Array of package names to enrich
 * @param limit - Maximum number of packages to return (default: 10)
 * @returns Array of enriched package data
 */
export async function enrichPackageSearchResults(
  packageNames: string[],
  limit: number = 10,
) {
  // Limit the number of packages to process
  const limitedPackageNames = packageNames.slice(0, limit);

  // Fetch enriched data for each package in parallel
  const enrichedPackages = await Promise.allSettled(
    limitedPackageNames.map(
      async (name): Promise<EnrichedPackageData | null> => {
        const enrichedData =
          await PackageService.getEnrichedPackageByName(name);
        if (!enrichedData) {
          return null;
        }

        const {
          pkg,
          groupedRelations,
          authorsList,
          maintainer,
          dailyDownloads,
          totalMonthDownloads,
          totalYearDownloads,
          isTrending,
          lastRelease,
        } = enrichedData;

        return {
          name: pkg.name,
          title: pkg.title,
          description: pkg.description,
          synopsis: pkg.synopsis,
          version: pkg.version,
          licenses: pkg.licenses,
          needs_compilation: pkg.needs_compilation,
          r_version: pkg.r_version,
          last_released_at: pkg.last_released_at,
          url: `${BASE_URL}/package/${encodeURIComponent(pkg.name)}`,
          lastRelease,
          authors: authorsList.map((a) => ({
            name: a.name,
            url: `${BASE_URL}/author/${encodeURIComponent(a.name)}`,
          })),
          maintainer: maintainer
            ? {
                name: maintainer.name,
                url: `${BASE_URL}/author/${encodeURIComponent(maintainer.name)}`,
              }
            : null,
          relations: groupedRelations,
          statistics: {
            downloads: {
              lastMonth: totalMonthDownloads,
              lastYear: totalYearDownloads,
              history: dailyDownloads,
            },
            isTrending,
          },
        };
      },
    ),
  );

  // Filter out rejected promises and null values
  return enrichedPackages
    .filter(
      (result): result is PromiseFulfilledResult<EnrichedPackageData> =>
        result.status === "fulfilled" && result.value !== null,
    )
    .map((result) => result.value);
}
