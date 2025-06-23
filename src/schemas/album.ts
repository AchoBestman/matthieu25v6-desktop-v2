import { z } from "zod";

// Album schema and type
export const AlbumSchema = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string(),
  uuid: z.string(),
  is_active: z.string(),
});
export type Album = z.infer<typeof AlbumSchema>;

// AlbumColumnDef schema and type
export const AlbumColumnDefSchema = z.object({
  title: z.string(),
  description: z.string(),
  uuid: z.string(),
  is_active: z.string(),
});
export type AlbumColumnDef = z.infer<typeof AlbumColumnDefSchema>;

// AlbumSearchParams schema and type
export const AlbumSearchParamsSchema = z.object({
  search: z.string().optional(),
  per_page: z.number().optional(),
  is_active: z.string().optional(),
  page: z.number().optional(),
});
export type AlbumSearchParams = z.infer<typeof AlbumSearchParamsSchema>;
