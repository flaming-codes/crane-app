import { z } from "zod";
import { Database } from "./supabase.types.generated";

export const packageNameSchema = z.string().min(1).max(300);

export const packageIdSchema = z.number().int().positive().min(1);

export type PackageSlug = z.infer<typeof packageNameSchema>;

export type PackageSemanticSearchHit = {
  packageId: string;
  sources: Record<
    /* source name */
    string,
    /* source data */
    Database["public"]["Functions"]["match_package_embeddings"]["Returns"]
  >;
};
