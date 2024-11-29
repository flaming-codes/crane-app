import { z } from "zod";

export const authorNameSchema = z.string().min(1).max(300);

export const authorIdSchema = z.number().int().positive().min(1);
