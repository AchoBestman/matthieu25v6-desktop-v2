import { ResourcesType } from "@/lib/resources";
import { allModels, oneModel } from "@/lib/resources/base";
import { AppDatabaseDir, downloadDrogressType, toObject } from "../utils";
import {
  createDataTypeSchema,
  DataType,
  parseConcordance,
  Sermon,
  SermonSchema,
  Verses,
} from "@/schemas/sermon";
import database, { dbExist } from "../database";
import { invoke } from "@tauri-apps/api/core";
import { mkdir } from "@tauri-apps/plugin-fs";
import { appDataDir } from "@tauri-apps/api/path";

export const findAll = async (
  resource: ResourcesType,
  lang: string,
  params?: { [key: string]: string | number | boolean },
  order?: { column: string; direction: "ASC" | "DESC" }
): Promise<DataType<Sermon>> => {

  const baseQuery = `SELECT s.*, v.number as verse_number FROM ${resource} s LEFT JOIN verses v ON v.sermon_id = s.id AND v.number = 1`;
  //const baseQuery = `SELECT * FROM ${resource}`; is the old one
  let countQuery = `SELECT COUNT(*) as total FROM ${resource}`;
  const conditions = [];
  const searchParams: any[] = [];

  if (params?.search) {
    conditions.push(
      `(title LIKE ? OR chapter LIKE ? OR publication_date LIKE?)`
    );
    searchParams.push(
      `%${params.search}%`,
      `%${params.search}%`,
      `%${params.search}%`
    );
  }

  if (params?.number) {
    conditions.push(`number = ?`);
    searchParams.push(params.number);
  }
  conditions.push(`is_active = ?`);
  searchParams.push(1);

  if (conditions.length > 0) {
    const whereClause = ` WHERE ` + conditions.join(" AND ");
    countQuery += whereClause;
  }

  const response = await allModels<Sermon>(
    lang,
    baseQuery,
    countQuery,
    searchParams,
    conditions,
    params,
    order
  );

  const result = createDataTypeSchema(SermonSchema).safeParse(response);

  if (!result.success) {
    throw new Error("Zod validation failed: " + result.error);
  }

  return result.data;
};

export const findAllVerses = async (
  resource: ResourcesType, // "verses"
  lang: string,
  params?: { [key: string]: string | number | boolean },
  order?: { column: string; direction: "ASC" | "DESC" }
): Promise<Array<Verses & { sermon_number: number }>> => {
  const db = await database(lang);

  let baseQuery = `
    SELECT 
      v.id, 
      v.sermon_id,
      v.number,
      v.title, 
      v.content, 
      v.verse_links, 
      s.is_active,
      s.number as sermon_number
    FROM ${resource} v
    INNER JOIN sermons s ON v.sermon_id = s.id
    WHERE s.is_active = 1
  `;

  const searchParams: any[] = [];
  if (!params?.search) {
    return [];
  }
  if (params?.search) {
    baseQuery += ` AND (v.title LIKE ? OR v.content LIKE ?)`;
    searchParams.push(`%${params.search}%`, `%${params.search}%`);
  }

  if (order) {
    baseQuery += ` ORDER BY v.${order.column} ${order.direction}`;
  }

  const response = await db.select(baseQuery, searchParams);

  return response as Array<Verses & { sermon_number: number }>;
};

export const findBy = async (
  resource: ResourcesType,
  lang: string,
  params: { column: string; value: string | number | boolean },
  relationships?: { table: string; type: "BelongsTo" | "HasOne" | "HasMany" }[],
  onProgress?: (percent: downloadDrogressType) => void
): Promise<Sermon> => {
  const response = await oneModel<Sermon>(
    resource,
    lang,
    params,
    relationships,
    onProgress
  );

  const model = response as Sermon;
  const sermon = {
    ...model,
    verses: model.verses?.map((value: any) => {
      return {
        id: value.id,
        sermon_id: value.sermon_id,
        concordance: value.concordance,
        concordances: value.concordance
          ? {
              id: value.id,
              num_pred: value.num_pred,
              num_verset: value.num_verset,
              concordance: parseConcordance(value.concordance),
            }
          : undefined,
        content: value.content,
        info: value.info,
        link_at_content: value.link_at_content,
        title: value.title,
        verse_links: Array.isArray(toObject(value.verse_links))
          ? toObject(value.verse_links)
          : null,
        number: value.number,
        url_content: value.url_content,
      };
    }),
  };

  const result = SermonSchema.safeParse(sermon);

  if (!result.success) {
    throw new Error("Zod validation failed: " + result.error);
  }

  return result.data;
};

export const findImage = async (lang: string, name: string) => {
  if (!/^[A-Za-z]{2}-[A-Za-z]{2,4}$/.test(lang)) {
    throw new Error(
      `Invalid format: ${lang} must be in the format 'AA-AA{BC}'`
    );
  }
  const [country, langue] = lang.toLowerCase().split("-");
  const relativePath = `${country}/matth25v6_${langue}.db`;

  // Ensure the folder exists

  await mkdir(country, {
    baseDir: AppDatabaseDir,
    recursive: true,
  });

  const dbExists = await dbExist(lang);
  if (!dbExists) return { name, blobUrl: null };

  // 🔥 Résoudre le chemin absolu vers le fichier db
  //const dbPath = await resolveResource(relativePath);
  // ⚠️ si ton fichier est bien copié dans "resources" au build
  // sinon -> utilise appDataDir + relativePath
  const dbPath = (await appDataDir()) + "/" + relativePath;

  // appel du Rust command fetch_blob
  const blob: number[] = await invoke("fetch_blob", {
    dbPath,
    name,
  });

  // `blob` est un tableau de bytes → tu le convertis en Uint8Array
  const buffer = new Uint8Array(blob);
  // tu peux créer une URL pour l’afficher comme image
  const blobUrl = URL.createObjectURL(new Blob([buffer]));

  return {
    name,
    blobUrl,
  };
};
