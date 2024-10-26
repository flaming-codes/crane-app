import { ENV } from "./env";
import { fetchData } from "./fetch";
import { packageSlugSchema } from "./package.shape";
import { OverviewPkg, Pkg } from "./types";

export class PackageService {
  private static allOverviewPackages: OverviewPkg[] = [];

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
}
