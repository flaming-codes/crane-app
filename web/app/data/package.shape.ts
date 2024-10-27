import { z } from "zod";

export const packageSlugSchema = z.string().min(1).max(300);

export type PackageSlug = z.infer<typeof packageSlugSchema>;
