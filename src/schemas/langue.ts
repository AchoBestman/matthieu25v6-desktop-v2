import { z } from "zod";

export const LangueSchema = z.object({
  id: z.number(),
  libelle: z.string(),
  initial: z.string(),
  main: z.number(),
  country_id: z.number().optional(),
  web_translation: z.string(),
});

export type Langue = z.infer<typeof LangueSchema>;
