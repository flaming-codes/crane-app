import { addHours } from "date-fns";
import { ENV } from "./env";
import { ExpiringSearchIndex } from "./types";

type PlausibleDataPoint = { page: string; visitors: number };

type TopPageDomain = "authors" | "packages" | "start" | "about";
type TopPagesIndex = Record<TopPageDomain, Array<PlausibleDataPoint>>;

export class PageInsightService {
  private static plausibleBaseUrl = "https://plausible.io/api/v1/stats";

  private static topPages: ExpiringSearchIndex<TopPagesIndex> = {
    index: {
      authors: [],
      packages: [],
      start: [],
      about: [],
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
        start: [],
        about: [],
      };

      results.forEach((item: PlausibleDataPoint) => {
        const getDomain = (): TopPageDomain => {
          if (item.page === "/") return "start";
          if (item.page === "/about") return "about";
          if (item.page.startsWith("/author/")) return "authors";
          return "packages";
        };

        const domain = getDomain();

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
