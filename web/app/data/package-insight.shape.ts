import { z } from "zod";

export const topDownloadedPackagesRangeSchema = z.union([
  z.literal("last-day"),
  z.literal("last-week"),
  z.literal("last-month"),
]);

export type TopDownloadedPackagesRange = z.infer<
  typeof topDownloadedPackagesRangeSchema
>;

export const cranDownloadsResponseSchema = z.array(
  z.object({
    downloads: z.array(
      z.object({
        day: z.string(),
        downloads: z.number(),
      }),
    ),
    start: z.string(),
    end: z.string(),
    package: z.string(),
  }),
);

export type CranDownloadsResponse = z.infer<typeof cranDownloadsResponseSchema>;

export const cranTopDownloadedPackagesResSchema = z.object({
  start: z.string(),
  end: z.string(),
  downloads: z.array(
    z.object({
      package: z.string(),
      downloads: z.number(),
    }),
  ),
});

export type CranTopDownloadedPackagesRes = z.infer<
  typeof cranTopDownloadedPackagesResSchema
>;

/**
 * Trending packages are the ones that were downloaded at least 1000 times during last week,
 * and that substantially increased their download counts, compared to the average weekly downloads in the previous 24 weeks.
 * The percentage of increase is also shown in the output.
 */
export const cranTrendingPackagesResSchema = z.array(
  z.object({
    package: z.string(),
    increase: z.string(),
  }),
);

export type CranTrendingPackagesRes = z.infer<
  typeof cranTrendingPackagesResSchema
>;

export type CranResponse =
  | CranDownloadsResponse
  | CranTopDownloadedPackagesRes
  | CranTrendingPackagesRes;
