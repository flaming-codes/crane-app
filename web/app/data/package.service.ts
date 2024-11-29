import { uniqBy } from "es-toolkit";
import { ENV } from "./env";
import { fetchData } from "./fetch";
import { packageIdSchema, packageNameSchema } from "./package.shape";
import { ExpiringSearchIndex, OverviewPkg, SitemapPackage } from "./types";
import MiniSearch from "minisearch";
import { addHours } from "date-fns";
import { Tables } from "./supabase.types.generated";
import { supabase } from "./supabase.server";
import { slog } from "../modules/observability.server";
import { authorIdSchema } from "./author.shape";

type Package = Tables<"cran_packages">;

export class PackageService {
  private static allOverviewPackages: OverviewPkg[] = [];

  private static allSitemapPackages: SitemapPackage[] = [];

  private static _packagesSearchIndex: ExpiringSearchIndex<
    MiniSearch<OverviewPkg>
  > = {
    index: new MiniSearch<OverviewPkg>({ fields: ["ignore"] }),
    expiresAt: 0,
  };

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

  static async getAllSitemapPackages(): Promise<SitemapPackage[]> {
    if (this.allSitemapPackages.length === 0) {
      const items = await fetchData<SitemapPackage[]>(
        ENV.VITE_SITEMAP_PKGS_URL,
      );
      this.allSitemapPackages = items.map(([name, lastMod]) => [
        this.sanitizeSitemapName(name),
        lastMod,
      ]);
    }
    return this.allSitemapPackages;
  }

  static async searchPackages(query: string, options?: { limit?: number }) {
    const { limit = 20 } = options || {};

    if (this._packagesSearchIndex.expiresAt < Date.now()) {
      await this.initSearchablePackagesIndex();
    }

    const hits = this._packagesSearchIndex.index
      .search(query, { fuzzy: 0.3, prefix: true })
      .slice(0, limit);

    return hits || [];
  }

  private static sanitizeSitemapName(name: string) {
    let next = name.trim();
    if (next.startsWith(`"`)) next = next.slice(1);
    if (next.endsWith(`"`)) next = next.slice(0, -1);
    if (next.endsWith(",")) next = next.slice(0, -1);
    return next.trim();
  }

  private static async initSearchablePackagesIndex() {
    this._packagesSearchIndex = {
      expiresAt: addHours(Date.now(), 12).getTime(),
      index: new MiniSearch({
        idField: "name",
        fields: ["name", "title"],
        storeFields: ["name", "slug", "description", "author_names"],
      }),
    };

    const packages = await this.getAllOverviewPackages().then((pkgs) =>
      uniqBy(pkgs, (pkg) => pkg.name),
    );

    const searchablePackages: OverviewPkg[] = packages.map((pkg) => ({
      name: pkg.name,
      slug: pkg.slug,
      title: pkg.title,
      author_names: pkg.author_names,
    }));

    this._packagesSearchIndex.index.addAll(searchablePackages);
  }
}
