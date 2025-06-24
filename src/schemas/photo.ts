import { z } from "zod";
import { ModelRefSchema } from "./model-ref";
import { EventSchema } from "./event";

// Photo schema
export const PhotoSchema = z.object({
  id: ModelRefSchema,
  url: z.string(),
  title: z.string().optional(),
  description: z.string().optional(),
  event: EventSchema.optional(),
});

// PhotoSerchParams schema (note: likely meant to be `PhotoSearchParams`)
export const PhotoSearchParamsSchema = z.object({
  search: z.string().optional(),
  per_page: z.number().optional(),
  page: z.number().optional(),
});

// Optional inferred types
export type Photo = z.infer<typeof PhotoSchema>;
export type PhotoSearchParams = z.infer<typeof PhotoSearchParamsSchema>;
