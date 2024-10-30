import { z } from "zod";

export const topDownloadedPackagesRangeSchema = z.union([
  z.literal("last-day"),
  z.literal("last-week"),
  z.literal("last-month"),
]);

export type TopDownloadedPackagesRange = z.infer<
  typeof topDownloadedPackagesRangeSchema
>;
