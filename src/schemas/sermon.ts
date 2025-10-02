import { z } from "zod";

type ParsedReference = {
  label: string;
  sermon_number: number;
  verse_number: number;
};

export function parseConcordance(input: string): ParsedReference[] {
  const regex = /\[Kc\.(\d+)v([\d,\-\s]+)\]/g;
  const result: ParsedReference[] = [];

  let match: RegExpExecArray | null;
  while ((match = regex.exec(input)) !== null) {
    const sermonNumber = parseInt(match[1], 10);
    const verseParts = match[2].replace(/\s+/g, "").split(",");

    let firstVerse = verseParts[0];
    if (firstVerse.includes("-")) {
      firstVerse = firstVerse.split("-")[0];
    }

    result.push({
      label: match[0],
      sermon_number: sermonNumber,
      verse_number: parseInt(firstVerse, 10),
    });
  }

  return result;
}

const ModelRefSchema = z.number();

const ConcordanceItemSchema = z.object({
  label: z.string(),
  sermon_number: z.number(),
  verse_number: z.number(),
});

export const ConcordanceSchema = z.object({
  id: ModelRefSchema,
  num_pred: z.number(),
  num_verset: z.number(),
  concordance: z.array(ConcordanceItemSchema),
});

export const VersesSchema = z.object({
  id: ModelRefSchema,
  number: z.number(),
  content: z.string(),
  info: z.string().optional().nullable(),
  link_at_content: z.string().optional().nullable(),
  url_content: z.string().optional().nullable(),
  title: z.string().optional().nullable(),
  sermon_id: ModelRefSchema,
  concordances: ConcordanceSchema.optional().nullable(),
  concordance: z.string().optional().nullable(),
  verse_links: z
    .array(
      z.object({
        url: z.string().nonempty(),
        type: z.string().nonempty(),
        fileName: z.string().nullable(),
        content: z.string().nullable(),
      })
    )
    .nullable(),
});

export const SermonSchema = z.object({
  id: ModelRefSchema,
  title: z.string(),
  sub_title: z.string().nullable().optional(),
  number: z.number(),
  verse_number: z.union([z.number(), z.string()]).nullable().optional(),
  audio: z.string().nullable().optional(),
  audio_name: z.string().nullable().optional(),
  video: z.string().nullable().optional(),
  time: z.string().nullable().optional(),
  chapter: z.string(),
  cover_picture: z.string().nullable().optional(),
  cover: z.string().nullable().optional(),
  cover_url: z.string().nullable().optional(),
  similar_sermon: z.string().nullable().optional(),
  publication_date: z.string().nullable().optional(),
  pdf: z.string().nullable().optional(),
  epub: z.string().nullable().optional(),
  legende: z.string().nullable().optional(),
  verses: z.array(VersesSchema).optional().nullable(),
});

export const SermonSearchParamsSchema = z.object({
  search: z.string().optional(),
  number: z.number().optional(),
  per_page: z.number().optional(),
  limit: z.number().optional(),
  page: z.number().optional(),
  order: z.enum(["ASC", "DESC"]),
  is_active: z.coerce.number().optional(),
});

export const LinksTypeSchema = z.object({
  first: z.number().nullable(),
  last: z.number().nullable(),
  prev: z.number().nullable(),
  next: z.number().nullable(),
});

export const MetaTypeSchema = z.object({
  currentPage: z.number(),
  totalPages: z.number(),
  perPage: z.number(),
  total: z.number(),
});

export const createDataTypeSchema = <T extends z.ZodTypeAny>(itemSchema: T) =>
  z.object({
    data: z.array(itemSchema),
    pagination: z.object({
      links: LinksTypeSchema,
      meta: MetaTypeSchema,
    }),
  });

export type ModelRef = z.infer<typeof ModelRefSchema>;
export type Concordance = z.infer<typeof ConcordanceSchema>;
export type Verses = z.infer<typeof VersesSchema>;
export type Sermon = z.infer<typeof SermonSchema>;
export type SermonSearchParams = z.infer<typeof SermonSearchParamsSchema>;
export type LinksType = z.infer<typeof LinksTypeSchema>;
export type MetaType = z.infer<typeof MetaTypeSchema>;
export type DataType<T> = {
  data: T[];
  pagination: {
    links: LinksType;
    meta: MetaType;
  };
};

// Example: Sermon list type
export const SermonListSchema = createDataTypeSchema(SermonSchema);
export type SermonList = z.infer<typeof SermonListSchema>;
