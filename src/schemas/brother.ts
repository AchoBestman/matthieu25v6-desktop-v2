import { z } from "zod";
import { ModelRefSchema } from "./model-ref";
import { CountrySchema } from "./country";
import { AssemblySchema } from "./assembly";

// Singer schema and type
export const SingerSchema = z.object({
  id: ModelRefSchema,
  position: z.number(),
  country: CountrySchema,
});
export type Singer = z.infer<typeof SingerSchema>;

// Ministre schema and type
export const MinistreSchema = z.object({
  id: ModelRefSchema,
  libelle: z.string(),
  country: CountrySchema,
  assembly: AssemblySchema,
});
export type Ministre = z.infer<typeof MinistreSchema>;

// Head schema and type
export const HeadSchema = z.lazy(() =>
  z.object({
    id: ModelRefSchema,
    is_pastor: z.number(),
    principal: z.number(),
    brother_id: z.number(),
    assembly_id: z.number(),
    country_id: z.number(),
  })
);
export type Head = z.infer<typeof HeadSchema>;

export const SingleHeadSchema = z.lazy(() =>
  z.object({
    id: ModelRefSchema,
    is_pastor: z.number(),
    principal: z.number(),
    brother_id: z.number(),
    assembly_id: z.number(),
    country_id: z.number(),
    country: CountrySchema,
    assembly: AssemblySchema,
    brother: BrotherSchema,
  })
);
export type SingleHead = z.infer<typeof SingleHeadSchema>;

// Brother schema and type
export const BrotherSchema = z.object({
  id: ModelRefSchema,
  full_name: z.string(),
  phone: z.string().nullable(),
  email: z.string().nullable(),
  avatar: z.string().nullable(),
  facebook: z.string(),
  youtube: z.string(),
  heads: z.array(HeadSchema),
  singer: SingerSchema,
  ministres: z.array(MinistreSchema),
});
export type Brother = z.infer<typeof BrotherSchema>;

// BrotherList schema and type
export const BrotherListSchema = z.object({
  id: ModelRefSchema,
  full_name: z.string(),
  phone: z.string().nullable(),
  email: z.string().nullable(),
  avatar: z.string().nullable(),
  facebook: z.string(),
  youtube: z.string(),
  country: CountrySchema.nullable().optional(),
  singer: SingerSchema.optional(),
});
export type BrotherList = z.infer<typeof BrotherListSchema>;

// BrotherSearchParams schema and type
export const BrotherSearchParamsSchema = z.object({
  full_name: z.string().optional(),
  phone: z.number().optional(),
  email: z.string().optional(),
  assembly_id: z.number().optional(),
  country_id: z.number().optional(),
  per_page: z.number().optional(),
  is_head: z.boolean().optional(),
  is_minister: z.boolean().optional(),
  is_singer: z.boolean().optional(),
  page: z.number().optional(),
});
export type BrotherSerchParams = z.infer<typeof BrotherSearchParamsSchema>;
