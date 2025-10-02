import { z } from "zod";
import { ModelRefSchema } from "./model-ref";
import { EventSchema } from "./event";

// Define Video schema
export const VideoSchema = z.object({
  id: ModelRefSchema,
  url: z.string(),
  title: z.string().optional(),
  description: z.string().optional(),
  event: EventSchema.optional(),
});

// Define VideoSerchParams schema (probably a typo: should be VideoSearchParams)
export const VideoSearchParamsSchema = z.object({
  search: z.string().optional(),
  per_page: z.number().optional(),
  page: z.number().optional(),
});

// Optional inferred types
export type Video = z.infer<typeof VideoSchema>;
export type VideoSearchParams = z.infer<typeof VideoSearchParamsSchema>;
