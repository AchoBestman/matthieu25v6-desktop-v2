import { z } from "zod";
import { ModelRefSchema } from "./model-ref";

// Event schema
export const EventSchema = z.object({
  id: ModelRefSchema.optional(),
  libelle: z.string(),
  description: z.string().optional(),
});

// EventColumnDef schema
export const EventColumnDefSchema = z.object({
  id: ModelRefSchema,
  libelle: z.string(),
  description: z.string().optional(),
});

// Optional inferred types
export type Event = z.infer<typeof EventSchema>;
export type EventColumnDef = z.infer<typeof EventColumnDefSchema>;
