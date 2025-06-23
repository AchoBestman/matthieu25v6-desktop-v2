import { z } from "zod";
import { ModelRefSchema } from "./model-ref";
import { CountrySchema } from "./country";
import { AlbumSchema } from "./album";
import { BrotherSchema } from "./brother";

// SingSearchParams schema and type
export const SingSearchParamsSchema = z.object({
  search: z.number().optional(),
  per_page: z.number().optional(),
  page: z.number().optional(),
  album_id: z.number().optional(),
});
export type SingSerchParams = z.infer<typeof SingSearchParamsSchema>;

// Sing schema and type
export const SingSchema = z.object({
  id: ModelRefSchema,
  title: z.string(),
  audio: z.string(),
  file_name: z.string(),
  content: z.string().optional(),
  time: z.number().optional(),
});
export type Sing = z.infer<typeof SingSchema>;

// SingList schema and type
export const SingListSchema = SingSchema.extend({
  country: CountrySchema.optional(),
  brother: BrotherSchema.optional(),
  singer_id: z.number(),
  album_id: z.number(),
  is_active: z.number(),
  album: AlbumSchema.optional(),
});
export type SingList = z.infer<typeof SingListSchema>;
