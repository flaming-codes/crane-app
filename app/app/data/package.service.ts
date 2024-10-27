import { uniqBy } from "es-toolkit";
import { ENV } from "./env";
import { fetchData } from "./fetch";
import { packageSlugSchema } from "./package.shape";
import { ExpiringSearchIndex, OverviewPkg, Pkg } from "./types";
import MiniSearch from "minisearch";
import { addHours } from "date-fns";

export class PackageService {
  private static allOverviewPackages: OverviewPkg[] = [];
  private static _packagesSearchIndex: ExpiringSearchIndex<
    MiniSearch<OverviewPkg>
  > = {
    index: new MiniSearch<OverviewPkg>({ fields: ["ignore"] }),
    expiresAt: 0,
  };

  static async getPackage(packageId: string): Promise<Pkg | undefined> {
    packageSlugSchema.parse(packageId);
    const url = ENV.VITE_SELECT_PKG_URL.replace("{{id}}", packageId);
    const data = await fetchData<Pkg>(url);
    return Array.isArray(data) ? data[0] : data;
  }

  static async getAllOverviewPackages(): Promise<OverviewPkg[]> {
    if (this.allOverviewPackages.length === 0) {
      this.allOverviewPackages = await fetchData<OverviewPkg[]>(
        ENV.VITE_OVERVIEW_PKGS_URL,
      );
    }
    return this.allOverviewPackages;
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
