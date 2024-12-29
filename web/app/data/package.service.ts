import { packageIdSchema, packageNameSchema } from "./package.shape";
import { SitemapItem } from "./types";
import { Tables } from "./supabase.types.generated";
import { supabase } from "./supabase.server";
import { slog } from "../modules/observability.server";
import { authorIdSchema } from "./author.shape";
import { isJSONObject, uniqBy } from "es-toolkit";
import TTLCache from "@isaacs/ttlcache";
import { format, hoursToMilliseconds } from "date-fns";

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

    // TODO: Fix entries in DB.
    // TODO: Only handles references, no 'views' etc.
    if (data?.materials && Array.isArray(data.materials)) {
      data.materials = data.materials.map((m) => {
        // @ts-expect-error - JSON-type overly verbose.
        if (!isJSONObject(m) || !m.link) {
          return m;
        }
        return {
          ...m,
          // @ts-expect-error - JSON-type overly verbose.
          link: m.link.startsWith("https://")
            ? // @ts-expect-error - JSON-type overly verbose.
              m.link
            : // @ts-expect-error - JSON-type overly verbose.
              `https://cran.r-project.org/web/packages/${packageName}${m.link.startsWith("/") ? "" : "/"}${m.link}`,
        };
      });
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

    const [fts, exact] = await Promise.all([
      supabase.rpc("find_closest_packages", {
        search_term: query,
        result_limit: limit,
      }),
      // ! ilike is expense, but we want to make sure we get the exact match w/o case sensitivity.
      supabase
        .from("cran_packages")
        .select("id,name")
        .ilike("name", query)
        .maybeSingle(),
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
        levenshtein_distance: 0,
      });
    }

    return uniqBy(fts.data, (item) => item.id);
  }

  private static sanitizeSitemapName(name: string) {
    let next = name.trim();
    if (next.startsWith(`"`)) next = next.slice(1);
    if (next.endsWith(`"`)) next = next.slice(0, -1);
    if (next.endsWith(",")) next = next.slice(0, -1);
    return next.trim();
  }
}
