import { z } from "zod";

export const ModelRefSchema = z.number();
export type ModelRef = z.infer<typeof ModelRefSchema>;
