import { z } from "zod";

export const envSchema = z.object({
  NODE_ENV: z.string().optional(),
  VITE_RELEASE_CHANNEL: z.string().optional(),
  ARCJET_KEY: z.string().optional().describe("Arcjet Site Key"),
  VITE_PLAUSIBLE_SITE_ID: z.string().describe("Plausible Analytics Site ID"),
  VITE_PLAUSIBLE_API_KEY: z.string().describe("Plausible Analytics API Key"),
  POSTHOG_API_KEY: z
    .string()
    .optional()
    .describe("PostHog API key for server analytics"),
  POSTHOG_HOST: z
    .string()
    .default("https://eu.i.posthog.com")
    .describe("PostHog API host"),
  VITE_GOOGLE_ADSENSE_CLIENT_ID: z
    .string()
    .optional()
    .describe("Google AdSense client ID (ca-pub-*)"),
  VITE_GOOGLE_ADSENSE_SLOT_LEFT: z
    .string()
    .optional()
    .describe("Google AdSense left slot id"),
  VITE_GOOGLE_ADSENSE_SLOT_RIGHT: z
    .string()
    .optional()
    .describe("Google AdSense right slot id"),
  SUPABASE_URL: z.string().describe("Supabase Gateway-URL"),
  SUPABASE_ANON_KEY: z
    .string()
    .describe(
      "Supabase Anonymous Key to access data with most defensive permissions",
    ),
  // NPM provides the package version as a string
  // when running `npm run start`.
  npm_package_version: z
    .string()
    .optional()
    .transform((v) => {
      return v || "x.y.z";
    }),
  OTEL_ENABLED: z.string().optional(),
  OTEL_NAME: z.string().optional(),
  OTEL_TRACE_URL: z.string().optional(),
});

export const ENV = envSchema.parse(process.env);
