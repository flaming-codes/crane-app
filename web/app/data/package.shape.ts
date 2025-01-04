import { z } from "zod";

export const packageNameSchema = z.string().min(1).max(300);

export const packageIdSchema = z.number().int().positive().min(1);

export type PackageSlug = z.infer<typeof packageNameSchema>;
