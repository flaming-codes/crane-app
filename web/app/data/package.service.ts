import { packageIdSchema, packageNameSchema } from "./package.shape";
import { SitemapItem } from "./types";
import { Tables } from "./supabase.types.generated";
import { supabase } from "./supabase.server";
import { slog } from "../modules/observability.server";
import { authorIdSchema } from "./author.shape";
import { groupBy, uniqBy } from "es-toolkit";
import TTLCache from "@isaacs/ttlcache";
import { format, hoursToMilliseconds } from "date-fns";
import { embed } from "ai";
import { google } from "@ai-sdk/google";

type Package = Tables<"cran_packages">;

type CacheKey = "sitemap-items";

type CacheValue = SitemapItem[];

export class PackageService {
  private static cache = new TTLCache<CacheKey, CacheValue>({
    ttl: hoursToMilliseconds(6),
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
    const cached = this.cache.get("sitemap-items");
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

    const normalizedQuery = query.trim();

    // Check if at least one space and at least 8 characters
    const isSimilaritySearchEnabled = normalizedQuery.length >= 6;

    const [fts, exact, similarity] = await Promise.all([
      supabase.rpc("find_closest_packages", {
        search_term: normalizedQuery,
        result_limit: limit,
      }),
      // ! ilike is expensive, but we want to make sure we get the exact match w/o case sensitivity.
      supabase
        .from("cran_packages")
        .select("id,name")
        .ilike("name", normalizedQuery)
        .maybeSingle(),
      isSimilaritySearchEnabled
        ? supabase.rpc("match_package_embeddings", {
            query_embedding: await embed({
              value: normalizedQuery,
              model: google.textEmbeddingModel("text-embedding-004"),
            }).then((res) => res.embedding as unknown as string),
            match_threshold: 0,
            match_count: limit,
          })
        : null,
    ]);

    if (fts.error) {
      slog.error("Error in searchPackages", fts.error);
      return [];
    }

    if (exact.error) {
      slog.error("Error in searchPackages", exact.error);
      return [];
    }

    if (exact.data) {
      fts.data.unshift({
        ...exact.data,
        levenshtein_distance: 0.4,
      });
    }

    if (similarity) {
      if (similarity.error) {
        slog.error("Error in searchPackages", similarity.error);
      }
    }

    const sources = similarity?.data || [];
    const lexical = uniqBy(fts.data, (item) => item.id).filter((item) => {
      return !sources.some((s) => s.cran_package_id === item.id);
    });

    // Group sources by package id and source name, so that multiple hits per source & package
    // can be grouped together. `Object.values` is used to convert the object back to an array.
    const sourcesByPackage = groupBy(sources, (item) => item.cran_package_id);
    const groupedSourcesByPackageIds = Object.entries(sourcesByPackage).map(
      ([packageId, sources]) => ({
        packageId,
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
          .select("name")
          .eq("id", item.packageId)
          .maybeSingle();

        if (error || !data) {
          slog.error("Error in searchPackages", error);
          return null;
        }

        return {
          ...item,
          packageName: data.name,
        };
      }),
    );

    return {
      lexical,
      semantic: groupedSourcesByPackage,
      isSemanticPreferred: isSimilaritySearchEnabled && sources.length > 0,
    };
  }

  private static sanitizeSitemapName(name: string) {
    let next = name.trim();
    if (next.startsWith(`"`)) next = next.slice(1);
    if (next.endsWith(`"`)) next = next.slice(0, -1);
    if (next.endsWith(",")) next = next.slice(0, -1);
    return next.trim();
  }
}
