import { addHours, format } from "date-fns";
import { ExpiringSearchIndex } from "./types";
import {
  CranDownloadsResponse,
  CranResponse,
  CranTopDownloadedPackagesRes,
  CranTrendingPackagesRes,
  TopDownloadedPackagesRange,
} from "./package-insight.shape";
import { slog } from "../modules/observability.server";

export class PackageInsightService {
  private static readonly CRAN_LOGS_URL = "https://cranlogs.r-pkg.org";

  private static trendingPackages: ExpiringSearchIndex<CranTrendingPackagesRes> =
    {
      index: [],
      expiresAt: 0,
    };

  static async getTopDownloadedPackages(
    period: TopDownloadedPackagesRange,
    count: number,
  ) {
    return await this.fetchFromCRAN<CranTopDownloadedPackagesRes>(
      `/top/${period}/${count.toString()}`,
    );
  }

  static async getTrendingPackages() {
    // Check if the index has expired.
    if (this.trendingPackages.expiresAt < Date.now()) {
      // Only for last week.
      const data = await this.fetchFromCRAN<CranTrendingPackagesRes>(
        "/trending",
      ).then((data) => {
        return data.map((item) => ({
          ...item,
          increase: `${new Number(item.increase).toFixed(0)}%`,
        }));
      });

      this.trendingPackages = {
        index: data,
        expiresAt: addHours(new Date(), 6).getTime(),
      };
    }

    return this.trendingPackages.index;
  }

  static async getDailyDownloadsForPackage(
    name: string,
    range: TopDownloadedPackagesRange,
  ): Promise<CranDownloadsResponse> {
    return this
      .fetchLogsFromCRAN<CranDownloadsResponse>`/downloads/daily/${range}/${name}`;
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

  /**
   * Tagged template literal for the CRAN downloads endpoint that
   * fetches the statistics for the provided url.
   *
   * @param template
   * @param params
   * @returns
   */
  private static async fetchLogsFromCRAN<R extends CranResponse = CranResponse>(
    template: TemplateStringsArray,
    ...params: (string | Date)[]
  ): Promise<R> {
    const url = this.getCRANLogsUrl(template, ...params);
    return this.fetchFromCRAN<R>(url);
  }

  /**
   * Tagged template literal for the CRAN statistics API
   * that creates the correct url and turns any date into
   * the correct format.
   *
   * @param template
   * @param params
   * @returns
   */
  private static getCRANLogsUrl(
    template: TemplateStringsArray,
    ...params: (string | Date)[]
  ) {
    // Zip template and params together and remove the last empty ''.
    const zipped = template.slice(0, -1).reduce(
      (acc, part, i) => {
        return acc.concat(part, params[i]);
      },
      [] as (string | Date)[],
    );
    // Replace all dates with formatted dates.
    const stringified = zipped.map((part) => {
      if (typeof part === "string") return part;
      return format(part, "yyyy-MM-dd");
    });

    return stringified.join("");
  }

  private static format1kDelimiter(total: number) {
    return total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }
}
