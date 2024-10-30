import { z } from "zod";

export const articleSlugSchema = z.string().min(1).max(100);
