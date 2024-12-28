import { hoursToMilliseconds } from "date-fns";
import { ENV } from "./env";
import TTLCache from "@isaacs/ttlcache";
import { slog } from "../modules/observability.server";

type TopPagesCacheKey = "authors" | "packages" | "start" | "about";

type TopPagesCacheValue = { page: string; visitors: number };

export class PageInsightService {
  private static plausibleBaseUrl =
    "https://plausible.flaming.codes/api/v1/stats";

  private static topPagesCache = new TTLCache<
    TopPagesCacheKey,
    TopPagesCacheValue[]
  >({
    ttl: hoursToMilliseconds(1),
  });

  static async getTopPages() {
    const keys: TopPagesCacheKey[] = ["authors", "packages", "start", "about"];
    const topPages: Record<TopPagesCacheKey, TopPagesCacheValue[]> = {
      authors: [],
      packages: [],
      start: [],
      about: [],
    };

    const allCachedValues = keys.map((key) => {
      return this.topPagesCache.get(key);
    });

    if (allCachedValues.every((value) => value !== undefined)) {
      for (const key of keys) {
        topPages[key] = this.topPagesCache.get(key) || [];
      }
      return topPages;
    }

    const res = await this.composePlausibleRequest(
      `${this.plausibleBaseUrl}/breakdown`,
      {
        site_id: ENV.VITE_PLAUSIBLE_SITE_ID,
        period: "day",
        property: "event:page",
      },
    );

    if (!res.ok) {
      slog.error("Failed to fetch top pages", {
        status: res.status,
        statusText: res.statusText,
      });
      throw new Error("Failed to fetch top pages");
    }

    const { results } = await res.json();

    results.forEach((item: TopPagesCacheValue) => {
      const getDomain = (): TopPagesCacheKey => {
        if (item.page === "/") return "start";
        if (item.page === "/about") return "about";
        if (item.page.startsWith("/author/")) return "authors";
        return "packages";
      };
      topPages[getDomain()].push(item);
    });

    for (const key of keys) {
      this.topPagesCache.set(key, topPages[key]);
    }

    return topPages;
  }

  /*
   * Private methods.
   */

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
