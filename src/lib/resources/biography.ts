import { ResourcesType } from "@/lib/resources";
import database from "@/lib/database";
import { Biography } from "@/schemas/biography";

export const isCommon = false;

export const findBy = async (resource: ResourcesType, lang: string) => {
  const db = await database(lang, isCommon);
  const result = await db.select(`SELECT * FROM ${resource} LIMIT 1`);
  const [model] = result as Biography[];

  return model;
};
