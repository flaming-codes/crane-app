import { ENV } from "./env";
import { fetchData } from "./fetch";
import { packageSlugSchema } from "./package.shape";
import { Pkg } from "./types";

export class PackageService {
  static async getPackage(packageId: string): Promise<Pkg | undefined> {
    await packageSlugSchema.parse(packageId);

    const url = ENV.VITE_SELECT_PKG_URL.replace("{{id}}", packageId);

    const data = await fetchData<Pkg>(url);
    return Array.isArray(data) ? data[0] : data;
  }
}
