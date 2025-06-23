import { z } from "zod";
import { ModelRefSchema } from "./model-ref";

// Assembly schema
export const AssemblySchema = z.object({
  id: ModelRefSchema,
  name: z.string(),
  city: z.object({
    id: ModelRefSchema,
    libelle: z.string(),
    description: z.string().nullable(),
  }),
  head: z.object({
    id: ModelRefSchema,
    is_pastor: z.boolean(),
    principal: z.boolean(),
    country: z.object({
      id: ModelRefSchema,
      name: z.string(),
      sigle: z.string(),
    }),
    brother: z.object({
      id: ModelRefSchema,
      name: z.string(),
      phone: z.string(),
    }),
  }),
  localisation: z.string(),
  address: z.string().nullable(),
  photo: z.string(),
});
export type Assembly = z.infer<typeof AssemblySchema>;

// AssemblySearchParams schema
export const AssemblySearchParamsSchema = z.object({
  name: z.string().optional(),
  city_id: z.number().optional(),
  country_id: z.number().optional(),
  per_page: z.number().optional(),
  current_page: z.number().optional(),
  page: z.number().optional(),
  brother_id: z.number().optional(),
  is_active: z.boolean().optional(),
});
export type AssemblySerchParams = z.infer<typeof AssemblySearchParamsSchema>;
