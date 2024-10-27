import { addHours } from "date-fns";
import { ENV } from "./env";
import { ExpiringSearchIndex } from "./types";
import { BASE_URL } from "../modules/app";

type PlausibleDataPoint = { page: string; visitors: number };

type TopPagesIndex = Record<"authors" | "packages", Array<PlausibleDataPoint>>;

export class InsightService {
  private static plausibleBaseUrl = "https://plausible.io/api/v1/stats";

  private static topPages: ExpiringSearchIndex<TopPagesIndex> = {
    index: {
      authors: [],
      packages: [],
    },
    expiresAt: 0,
  };

  static async getTopPages() {
    if (this.topPages.expiresAt < Date.now()) {
      const res = await this.composePlausibleRequest(
        `${this.plausibleBaseUrl}/breakdown`,
        {
          site_id: ENV.VITE_PLAUSIBLE_SITE_ID,
          period: "day",
          property: "event:page",
        },
      );

      if (!res.ok) {
        throw new Error("Failed to fetch top pages");
      }

      const { results } = await res.json();

      const grouped: TopPagesIndex = {
        authors: [],
        packages: [],
      };

      results.forEach((item: PlausibleDataPoint) => {
        // Skip landing page.
        if (item.page === "/") {
          return;
        }

        const domain =
          item.page.indexOf("/author/") === 0 ? "authors" : "packages";
        if (!grouped[domain]) {
          grouped[domain] = [];
        }
        grouped[domain].push(item);
      });

      this.topPages.index = grouped;
      this.topPages.expiresAt = addHours(Date.now(), 1).getTime();
    }

    return this.topPages.index;
  }

  private static composePlausibleRequest(
    url: string,
    params: Record<string, string>,
  ) {
    const query = Object.entries(params)
      .map(([key, value]) => `${key}=${value}`)
      .join("&");
    return fetch(`${url}?${query}`, {
      headers: {
        Authorization: `Bearer ${ENV.VITE_PLAUSIBLE_API_KEY}`,
        "Content-Type": "application/json",
      },
    });
  }
}
