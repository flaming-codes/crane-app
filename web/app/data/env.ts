import { z } from "zod";

export const envSchema = z.object({
  NODE_ENV: z.string().optional(),
  VITE_RELEASE_CHANNEL: z.string().optional(),
  VITE_PLAUSIBLE_SITE_ID: z.string().describe("Plausible Analytics Site ID"),
  VITE_PLAUSIBLE_API_KEY: z.string().describe("Plausible Analytics API Key"),
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
  OTEL_LOG_URL: z.string().optional(), // P24ad
});

export const ENV = envSchema.parse(process.env);
