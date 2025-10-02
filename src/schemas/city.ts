import { z } from "zod";

export const CitySchema = z.object({
  id: z.number(),
  libelle: z.string(),
  description: z.string(),
});
export type City = z.infer<typeof CitySchema>;

export type SelectSearch = { id: number; type: string };

export enum SelectEnum {
  country = "country",
  city = "city",
  singer = "singer",
}

export type SelectType = "country" | "city" | "singer";
