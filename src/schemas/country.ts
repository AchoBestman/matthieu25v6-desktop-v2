import { z } from "zod";

// Country schema and type
export const CountrySchema = z.object({
  id: z.number(),
  name: z.string(),
  sigle: z.string(),
});
export type Country = z.infer<typeof CountrySchema>;
