import { z } from "zod";

export const envSchema = z.object({
  NODE_ENV: z.string().optional(),
  VITE_RELEASE_CHANNEL: z.string().optional(),
  VITE_API_KEY: z.string().describe("GitHub Personal Access Token"),
  VITE_PLAUSIBLE_SITE_ID: z.string().describe("Plausible Analytics Site ID"),
  VITE_PLAUSIBLE_API_KEY: z.string().describe("Plausible Analytics API Key"),
  VITE_STATS_GH_TRENDS_BASE_URL: z
    .string()
    .url()
    .describe("GitHub Trends Base URL"),
  VITE_BASE_OG_POSTER_API_URL: z
    .string()
    .url()
    .describe("Open Graph Poster API URL"),
  VITE_AP_PKGS_URL: z.string().url().describe("Packages by Author URL"),
  VITE_SELECT_PKG_URL: z.string().url().describe("Select Single Package URL"),
  VITE_TA_TEST_PKG_URL: z
    .string()
    .url()
    .describe("TypeAhead Test Packages URL"),
  VITE_TA_PKGS_URL: z.string().url().describe("TypeAhead Packages by Task URL"),
  VITE_OVERVIEW_PKGS_URL: z
    .string()
    .url()
    .describe("Packages for overview URL"),
  VITE_SITEMAP_PKGS_URL: z.string().url().describe("Packages for sitemap URL"),
  // NPM provides the package version as a string
  // when running `npm run start`.
  npm_package_version: z
    .string()
    .optional()
    .transform((v) => {
      return v || "x.y.z";
    }),
});

export const ENV = envSchema.parse(process.env);
