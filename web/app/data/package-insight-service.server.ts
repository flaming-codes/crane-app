import { format, sub } from "date-fns";
import {
  CranDownloadsResponse,
  CranResponse,
  PackageDownloadTrend,
} from "./types";

export class PackageInsightService {
  /**
   * Get the downloads for a package in the last n days, starting
   * from today. The result is an array of objects with the number
   * of downloads, the relative trend for the respective time period
   * and the label.
   *
   * @param name    The name of the package.
   * @returns       The downloads for the package.
   */
  static async getDownloadsWithTrends(
    name: string,
  ): Promise<PackageDownloadTrend[]> {
    const getDownloads = async (days: number, from?: Date) => {
      const res = await this.getPackageDownloadsLastNDays({
        name,
        days,
        from,
      });
      return res?.[0]?.downloads;
    };

    // Fetch all statistics in parallel.
    const now = new Date();
    const [stats, trendReferences] = await Promise.all([
      Promise.all([
        getDownloads(1),
        getDownloads(7, now),
        getDownloads(30, now),
        getDownloads(90, now),
        getDownloads(365, now),
      ]),
      Promise.all([
        getDownloads(0, sub(now, { days: 2 })),
        getDownloads(7, sub(now, { days: 7 })),
        getDownloads(30, sub(now, { days: 30 })),
        getDownloads(90, sub(now, { days: 90 })),
        getDownloads(365, sub(now, { days: 365 })),
      ]),
    ]);

    // Get rend in percentage.
    const trends = stats.map((stat, i) => {
      const ref = trendReferences[i];
      // No valid values.
      if (stat === undefined || ref === undefined || ref === 0) {
        return "";
      }
      const diff = stat - ref;
      return `${diff > 0 ? "+" : ""}${((diff / ref) * 100).toFixed(0)}%`;
    });

    // Aggregate the statistics into a single object.
    const labels = [
      "Yesterday",
      "Last 7 days",
      "Last 30 days",
      "Last 90 days",
      "Last 365 days",
    ];
    const downloads = stats
      .map((value, i) => ({
        value,
        trend: trends[i],
        label: labels[i],
      }))
      .filter(({ value }) => value !== undefined)
      .map(({ value, ...rest }) => ({
        value: this.format1kDelimiter(value),
        ...rest,
      }));

    return downloads;
  }

  /*
   * Private.
   */

  private static async getPackageDownloadsLastNDays(params: {
    name: string;
    days: number;
    from?: Date;
  }) {
    const { name, days, from } = params;

    // Special case as the logs-API returns data earliest for
    // the last day according to its point of reference (likely UTC).
    if (days === 1 && !from) {
      return this
        .fetchFromCRAN<CranDownloadsResponse>`/downloads/total/last-day/${name}`;
    }

    const validFrom = from || new Date();
    const past = sub(validFrom, { days });
    return this
      .fetchFromCRAN<CranDownloadsResponse>`/downloads/total/${past}:${validFrom}/${name}`;
  }

  /**
   * Tagged template literal for the CRAN downloads endpoint that
   * fetches the statistics for the provided url.
   *
   * @param template
   * @param params
   * @returns
   */
  private static async fetchFromCRAN<R extends CranResponse = CranResponse>(
    template: TemplateStringsArray,
    ...params: (string | Date)[]
  ): Promise<R> {
    const url = this.getCRANLogsUrl(template, ...params);
    return fetch(url, {
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .catch(() => undefined);
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

    return "https://cranlogs.r-pkg.org" + stringified.join("");
  }

  private static format1kDelimiter(total: number) {
    return total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }
}
