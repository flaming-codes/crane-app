import { packageIdSchema, packageNameSchema } from "./package.shape";
import { SitemapItem } from "./types";
import { Tables } from "./supabase.types.generated";
import { supabase } from "./supabase.server";
import { slog } from "../modules/observability.server";
import { authorIdSchema } from "./author.shape";
import { groupBy, omit, uniqBy } from "es-toolkit";
import TTLCache from "@isaacs/ttlcache";
import {
  format,
  formatRelative,
  hoursToMilliseconds,
  minutesToMilliseconds,
  subDays,
} from "date-fns";
import { google } from "@ai-sdk/google";
import { embed } from "ai";
import { AuthorService } from "./author.service";
import { PackageInsightService } from "./package-insight.service.server";

// import { embed } from "ai";
// import { google } from "@ai-sdk/google";

type Package = Tables<"cran_packages">;

type CacheKey = "sitemap-items" | "count-packages";

type CacheValue = SitemapItem[] | number;

type SearchResult = {
  combined: Array<{
    name: string;
    synopsis: string;
  } | null>;
  isSemanticPreferred: boolean;
};

type EnrichedPackage = {
  pkg: Package;
  relations: Awaited<
    ReturnType<typeof PackageService.getPackageRelationsByPackageId>
  >;
  groupedRelations: ReturnType<typeof groupBy<any, string>>;
  authorsData: Awaited<ReturnType<typeof AuthorService.getAuthorsByPackageId>>;
  authorsList: Array<Tables<"authors"> & { roles: string[] }>;
  maintainer: (Tables<"authors"> & { roles: string[] }) | undefined;
  dailyDownloads: Awaited<
    ReturnType<typeof PackageInsightService.getDailyDownloadsForPackage>
  >;
  yearlyDailyDownloads: Awaited<
    ReturnType<typeof PackageInsightService.getDailyDownloadsForPackage>
  >;
  trendingPackages: Awaited<
    ReturnType<typeof PackageInsightService.getTrendingPackages>
  >;
  totalMonthDownloads: number;
  totalYearDownloads: number;
  isTrending: boolean;
  lastRelease: string;
};

export class PackageService {
  /** Cache for singular domains, e.g. the sitemap. */
  private static cache = new TTLCache<CacheKey, CacheValue>({
    ttl: hoursToMilliseconds(6),
  });

  /**
   * Specific cache for search hits by query as key.
   * ! This is a global cache on the server for all users.
   * Not an issue as the search results are not user-specific,
   * but it's important to keep in mind.
   * */
  private static cachedHits = new TTLCache<string, SearchResult>({
    ttl: minutesToMilliseconds(5),
    max: 100,
  });

  private static readonly sitemapDivisor = 1000;

  static async getPackageByName(packageName: string): Promise<Package | null> {
    packageNameSchema.parse(packageName);

    const { data, error } = await supabase
      .from("cran_packages")
      .select("*")
      .eq("name", packageName)
      .maybeSingle();

    if (error) {
      slog.error("Error in getPackageByName", error);
      return null;
    }

    return data;
  }

  /**
   * Get enriched package data with relations, authors, maintainer, downloads, and trending status.
   * This method consolidates the data fetching and processing logic used by both
   * the MCP resource and the package page loader to follow DRY principle.
   */
  static async getEnrichedPackageByName(
    packageName: string,
  ): Promise<EnrichedPackage | null> {
    packageNameSchema.parse(packageName);

    const pkg = await this.getPackageByName(packageName);
    if (!pkg) {
      return null;
    }

    const now = new Date();

    const [
      relations,
      authorsData,
      dailyDownloads,
      yearlyDailyDownloads,
      trendingPackages,
    ] = await Promise.all([
      this.getPackageRelationsByPackageId(pkg.id),
      AuthorService.getAuthorsByPackageId(pkg.id),
      PackageInsightService.getDailyDownloadsForPackage(
        packageName,
        "last-month",
      ),
      PackageInsightService.getDailyDownloadsForPackage(
        packageName,
        `${format(subDays(now, 365), "yyyy-MM-dd")}:${format(now, "yyyy-MM-dd")}`,
      ),
      PackageInsightService.getTrendingPackages(),
    ]);

    // Process Relations
    const groupedRelations = groupBy(
      relations || [],
      (item) => item.relationship_type,
    );

    // Process Authors & Maintainers
    const authorsList = (authorsData || [])
      .map(({ author, roles }) => ({
        ...((Array.isArray(author) ? author[0] : author) as Tables<"authors">),
        roles: roles || [],
      }))
      .filter((a) => !a.roles.includes("mnt"));

    const maintainer = (authorsData || [])
      .map(({ author, roles }) => ({
        ...((Array.isArray(author) ? author[0] : author) as Tables<"authors">),
        roles: roles || [],
      }))
      .filter((a) => a.roles.includes("mnt"))
      .at(0);

    // Process Downloads
    const totalMonthDownloads =
      dailyDownloads
        .at(0)
        ?.downloads?.reduce((acc, curr) => acc + curr.downloads, 0) || 0;

    const totalYearDownloads =
      yearlyDailyDownloads
        .at(0)
        ?.downloads?.reduce((acc, curr) => acc + curr.downloads, 0) || 0;

    const isTrending =
      trendingPackages.findIndex((item) => item.package === packageName) !== -1;

    const lastRelease = formatRelative(new Date(pkg.last_released_at), now);

    return {
      pkg,
      relations,
      groupedRelations,
      authorsData,
      authorsList,
      maintainer,
      dailyDownloads,
      yearlyDailyDownloads,
      trendingPackages,
      totalMonthDownloads,
      totalYearDownloads,
      isTrending,
      lastRelease,
    };
  }

  static async getPackageIdByName(packageName: string): Promise<number | null> {
    packageNameSchema.parse(packageName);

    const { data, error } = await supabase
      .from("cran_packages")
      .select("id")
      .eq("name", packageName)
      .maybeSingle();

    if (error) {
      slog.error("Error in getPackageIdByName", error);
      return null;
    }

    return data?.id || null;
  }

  static async getTotalPackagesCount(): Promise<number> {
    const cached = this.cache.get("count-packages") as number | undefined;
    if (cached) {
      return cached;
    }

    const { count, error } = await supabase
      .from("cran_packages")
      .select("*", { count: "exact", head: true });

    if (error) {
      slog.error("Error in getTotalPackagesCount", error);
      return 0;
    }

    this.cache.set("count-packages", count ?? 0);
    return count ?? 0;
  }

  static async getPackageRelationsByPackageId(packageId: number) {
    packageIdSchema.parse(packageId);

    const { data, error } = await supabase
      .from("cran_package_relationship")
      .select(
        `
        relationship_type,
        version,
        related_package:related_package_id (id,name)
        `,
      )
      .eq("package_id", packageId);

    if (error) {
      slog.error("Error in getPackageRelationsByPackageName", error);
      return null;
    }

    return data;
  }

  static async getPackagesByAuthorId(authorId: number) {
    authorIdSchema.parse(authorId);

    const { data, error } = await supabase
      .from("author_cran_package")
      .select(
        `
        author:author_id (id,name),
        package:package_id (id,name,title,description),
        roles
        `,
      )
      .eq("author_id", authorId);

    if (error) {
      slog.error("Error in getPackagesByAuthorId", error);
      return null;
    }

    return data;
  }

  static async checkPackageExistsByName(packageName: string): Promise<boolean> {
    packageNameSchema.parse(packageName);

    const { count, error } = await supabase
      .from("cran_packages")
      .select("*", { count: "exact", head: true })
      .eq("name", packageName);

    if (error) {
      slog.error("Error in checkPackageExistsByName", error);
      return false;
    }

    return count === 1;
  }

  static async getAllSitemapPackages(): Promise<SitemapItem[]> {
    const cached = this.cache.get("sitemap-items") as SitemapItem[] | undefined;
    if (cached) {
      return cached;
    }

    const countRes = await supabase
      .from("cran_packages")
      .select("id,name", { count: "exact", head: true });

    if (countRes.error) {
      slog.error("Error in getAllSitemapPackages", countRes.error);
      return [];
    }

    const chunks = Math.ceil((countRes.count ?? 0) / this.sitemapDivisor);

    const sitemapItems: SitemapItem[] = [];
    // Sequentially fetch all the chunks to avoid hitting the rate limit,
    // and no Promise.all to not stress the server too much.
    for (let i = 0; i < chunks; i++) {
      const { data, error } = await supabase
        .from("cran_packages")
        .select("name,last_released_at")
        .range(i * this.sitemapDivisor, (i + 1) * this.sitemapDivisor - 1);

      if (error) {
        slog.error("Error in getAllSitemapPackages", error);
        return [];
      }

      data.forEach((item) => {
        sitemapItems.push([
          this.sanitizeSitemapName(item.name),
          format(new Date(item.last_released_at), "yyyy-MM-dd"),
        ]);
      });
    }

    this.cache.set("sitemap-items", sitemapItems);
    return sitemapItems;
  }

  static async searchPackages(
    query: string,
    options?: { limit?: number; permutations?: number },
  ) {
    const { limit = 20 } = options || {};

    const isSimilaritySearchEnabled = query.length >= 3;
    const cacheKey = query.toLowerCase();

    const cached = this.cachedHits.get(cacheKey);
    if (cached) {
      return cached;
    }

    const rephrasedQuery = query;
    let queryEmbedding = "";
    if (isSimilaritySearchEnabled) {
      // console.log("---->", query);

      // console.time("---- generateText");
      // const model = google("gemini-1.5-flash-8b");
      // const [{ text: rephrased }, query_embedding] = await Promise.all([
      //   generateText({
      //     model,
      //     prompt:
      //       "Improve the following search phrase. Fix spelling issues and add highly relevant words, if any: " +
      //       query +
      //       ". Return only the improved search phrase and nothing else." +
      //       "Return original search phrase if no improvements are needed or if search phrase is package name.",
      //   }),
      //   embed({
      //     value: rephrasedQuery,
      //     model: google.textEmbeddingModel("text-embedding-004"),
      //   }).then((res) => res.embedding as unknown as string),
      // ]);
      // rephrasedQuery = rephrased.trim();
      // slog.log("info", `Rephrased query: ${rephrasedQuery}`);
      // queryEmbedding = query_embedding;
      // console.timeEnd("---- generateText");
      queryEmbedding = await embed({
        value: rephrasedQuery,
        model: google.textEmbeddingModel("text-embedding-004"),
      }).then((res) => res.embedding as unknown as string);
    }

    const [packageFTS, packageExact, embeddingSimilarity, embeddingFTS] =
      await Promise.all([
        supabase.rpc("find_closest_packages", {
          search_term: query,
          result_limit: limit,
        }),
        // ! ilike is expensive, but we want to make sure we get the exact match w/o case sensitivity.
        supabase
          .from("cran_packages")
          .select("id,name,synopsis")
          .ilike("name", query)
          .maybeSingle(),
        isSimilaritySearchEnabled
          ? supabase.rpc("match_package_embeddings", {
              query_embedding: queryEmbedding,
              match_threshold: 0.5,
              match_count: limit,
            })
          : null,
        supabase.rpc("find_closest_package_embeddings", {
          search_term: query,
          result_limit: limit,
        }),
      ]);

    if (packageFTS.error) {
      slog.error("Error in searchPackages FTS", packageFTS.error);
      throw packageFTS.error;
    }

    if (packageExact.error) {
      slog.error("Error in searchPackages Exact", packageExact.error);
      throw packageExact.error;
    }

    if (packageExact.data) {
      packageFTS.data.unshift({
        ...packageExact.data,
        levenshtein_distance: 0.4,
      });
    }

    if (embeddingSimilarity) {
      if (embeddingSimilarity.error) {
        slog.error(
          "Error in searchPackages Embeddings",
          embeddingSimilarity.error,
        );
      }
    }

    // console.log(
    //   "embeddingSimilarity",
    //   embeddingSimilarity?.data?.map((x) => {
    //     const { source_searchable_content, ...rest } = x;
    //     return rest;
    //   }),
    // );

    // Prefer the exact match over the similarity match.
    // Therefore we filter out the similarity match if it's the same as the exact match.
    const sources = [
      ...(embeddingSimilarity?.data || []),
      ...(embeddingFTS?.data || []),
    ]
      .filter((item) => {
        const hasExactMatch =
          packageExact.data && packageExact.data.id === item.cran_package_id;
        return !hasExactMatch;
      })
      .map((item) => {
        // Remove the source_searchable_content from the response
        // for now, as it's quite a lot of text data that's not
        // applied in the UI.
        return omit(item, ["source_searchable_content"]);
      });

    const lexical = uniqBy(packageFTS.data, (item) => item.id)
      .filter((item) => {
        return !sources.some((s) => s.cran_package_id === item.id);
      })
      .map((item) => ({
        name: item.name,
        synopsis: item.synopsis,
      }));

    // Group sources by package id and source name, so that multiple hits per source & package
    // can be grouped together. `Object.values` is used to convert the object back to an array.
    const sourcesByPackage = groupBy(sources, (item) => item.cran_package_id);
    const groupedSourcesByPackageIds = Object.entries(sourcesByPackage).map(
      ([packageId, sources]) => ({
        packageId: Number(packageId),
        sources: groupBy(sources, (item) => item.source_name),
      }),
    );

    // Fetch the package name for each package id.
    // This is not done inside the RPC call as we could
    // potentially have different package families (CRAN, Bioconductor, etc.).
    const groupedSourcesByPackage = await Promise.all(
      groupedSourcesByPackageIds.map(async (item) => {
        const { data, error } = await supabase
          .from("cran_packages")
          .select("name,synopsis")
          .eq("id", item.packageId)
          .maybeSingle();

        if (error || !data) {
          slog.error("Error in searchPackages fetching package data", error);
          return null;
        }

        return {
          name: data.name,
          synopsis: data.synopsis,
          sources: Object.entries(item.sources),
        };
      }),
    );

    const isSemanticPreferred =
      !packageExact.data && isSimilaritySearchEnabled && sources.length > 0;

    const result: SearchResult = {
      combined: isSemanticPreferred
        ? [...groupedSourcesByPackage, ...lexical]
        : [...lexical, ...groupedSourcesByPackage],
      isSemanticPreferred,
    };

    this.cachedHits.set(cacheKey, result);
    return result;
  }

  private static sanitizeSitemapName(name: string) {
    let next = name.trim();
    if (next.startsWith(`"`)) next = next.slice(1);
    if (next.endsWith(`"`)) next = next.slice(0, -1);
    if (next.endsWith(",")) next = next.slice(0, -1);
    return next.trim();
  }
}
