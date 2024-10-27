import { z } from "zod";

export const authorSlugSchema = z.string().min(1).max(300);

export type AuthorSlug = z.infer<typeof authorSlugSchema>;
