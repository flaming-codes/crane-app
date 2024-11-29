import { ENV } from "./env";
import { fetchData } from "./fetch";
import { packageIdSchema, packageNameSchema } from "./package.shape";
import { OverviewPkg, SitemapItem } from "./types";
import { Tables } from "./supabase.types.generated";
import { supabase } from "./supabase.server";
import { slog } from "../modules/observability.server";
import { authorIdSchema } from "./author.shape";
import { shuffle, uniqBy } from "es-toolkit";
import TTLCache from "@isaacs/ttlcache";
import { format, hoursToMilliseconds } from "date-fns";

type Package = Tables<"cran_packages">;

type CacheKey = "sitemap-items";

type CacheValue = SitemapItem[];

export class PackageService {
  private static allOverviewPackages: OverviewPkg[] = [];

  private static cache = new TTLCache<CacheKey, CacheValue>({
    ttl: hoursToMilliseconds(6),
  });

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

  static async getAllOverviewPackages(): Promise<OverviewPkg[]> {
    if (this.allOverviewPackages.length === 0) {
      this.allOverviewPackages = await fetchData<OverviewPkg[]>(
        ENV.VITE_OVERVIEW_PKGS_URL,
      );
    }
    return this.allOverviewPackages;
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

    const divisor = 1_000;
    const chunks = Math.ceil((countRes.count ?? 0) / divisor);

    const sitemapItems: SitemapItem[] = [];
    // Sequentially fetch all the chunks to avoid hitting the rate limit,
    // and no Promise.all to not stress the server too much.
    for (let i = 0; i < chunks; i++) {
      const { data, error } = await supabase
        .from("cran_packages")
        .select("name,last_released_at")
        .range(i * divisor, (i + 1) * divisor - 1);

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
    const { limit = 20, permutations = 3 } = options || {};

    const randomQueries = Array.from({ length: permutations }, () => {
      return shuffle(query.split(" ")).join(" ");
    });

    const allQueries = [query, ...randomQueries];

    const nestedHits = await Promise.all(
      allQueries.map(async (query) => {
        const { data, error } = await supabase
          .from("cran_packages")
          .select("id,name")
          .textSearch("name, title, description", query, { config: "english" })
          .limit(limit);

        if (error) {
          slog.error("Error in searchPackages", error);
          return [];
        }

        return data;
      }),
    );

    return uniqBy(nestedHits.flat(), (item) => item.id);
  }

  private static sanitizeSitemapName(name: string) {
    let next = name.trim();
    if (next.startsWith(`"`)) next = next.slice(1);
    if (next.endsWith(`"`)) next = next.slice(0, -1);
    if (next.endsWith(",")) next = next.slice(0, -1);
    return next.trim();
  }
}
