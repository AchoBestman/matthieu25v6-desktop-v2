import { z } from "zod";

export const BiographySchema = z.object({
  id: z.number(),
  photo: z.string(),
  description: z.string(),
});
export type Biography = z.infer<typeof BiographySchema>;
