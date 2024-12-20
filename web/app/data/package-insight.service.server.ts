import { hoursToMilliseconds } from "date-fns";
import {
  CranDownloadsResponse,
  CranResponse,
  CranTopDownloadedPackagesRes,
  CranTrendingPackagesRes,
  TopDownloadedPackagesRange,
} from "./package-insight.shape";
import { slog } from "../modules/observability.server";
import TTLCache from "@isaacs/ttlcache";

type CacheKey =
  | "/trending"
  | `/downloads/daily/${TopDownloadedPackagesRange | (string & {})}/${string}`
  | `/top/${TopDownloadedPackagesRange}/${string}`
  | "r-releases-html";

export class PackageInsightService {
  private static readonly CRAN_LOGS_URL = "https://cranlogs.r-pkg.org";

  private static cache = new TTLCache<CacheKey, unknown>({
    ttl: hoursToMilliseconds(6),
    max: 1_000,
  });

  static async getTopDownloadedPackages(
    period: TopDownloadedPackagesRange,
    count: number,
  ) {
    const cachedData = this.cache.get(`/top/${period}/${count.toString()}`) as
      | CranTopDownloadedPackagesRes
      | undefined;
    if (cachedData) {
      return cachedData;
    }

    const data = await this.fetchFromCRAN<CranTopDownloadedPackagesRes>(
      `/top/${period}/${count.toString()}`,
    ).then((data) => {
      return data || [];
    });

    this.cache.set(`/top/${period}/${count.toString()}`, data);
    return data;
  }

  static async getTrendingPackages() {
    const cachedData = this.cache.get("/trending") as
      | CranTrendingPackagesRes
      | undefined;
    if (cachedData) {
      return cachedData;
    }

    const data = await this.fetchFromCRAN<CranTrendingPackagesRes>(
      "/trending",
    ).then((data) => {
      return (
        data?.map((item) => ({
          ...item,
          increase: `${new Number(item.increase).toFixed(0)}%`,
        })) || []
      );
    });

    this.cache.set("/trending", data);
    return data;
  }

  static async getDailyDownloadsForPackage(
    name: string,
    range: TopDownloadedPackagesRange | (string & {}),
  ): Promise<CranDownloadsResponse> {
    const cached = this.cache.get(`/downloads/daily/${range}/${name}`) as
      | CranDownloadsResponse
      | undefined;
    if (cached) {
      return cached;
    }

    const data = await this.fetchFromCRAN<CranDownloadsResponse>(
      `/downloads/daily/${range}/${name}`,
    ).then((data) => {
      return data || [];
    });

    this.cache.set(`/downloads/daily/${range}/${name}`, data);
    return data;
  }

  static async getReleasesHTML() {
    const cachedData = this.cache.get<string>("r-releases-html");
    if (cachedData) {
      return cachedData;
    }

    const sources = [
      "https://cran.r-project.org/bin/windows/base/",
      "https://cran.r-project.org/bin/macosx/",
    ];

    const [windows, macos] = await Promise.allSettled(
      sources.map((source) =>
        fetch(source).then((response) => response.text()),
      ),
    );

    const data = [
      windows.status === "fulfilled" ? windows.value : "",
      macos.status === "fulfilled" ? macos.value : "",
    ].join("");

    this.cache.set("r-releases-html", data);
    return data;
  }

  /*
   * Private.
   */

  private static async fetchFromCRAN<R extends CranResponse = CranResponse>(
    url: string,
  ): Promise<R> {
    return fetch(this.CRAN_LOGS_URL + url, {
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => response.json())
      .catch((error) => {
        slog.error("Failed to fetch CRAN statistics", error);
        return undefined;
      });
  }
}
