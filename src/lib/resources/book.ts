import { ResourcesType } from "@/lib/resources";
import database from "@/lib/database";
import { Book } from "@/types/book";

export const findBy = async(resource: ResourcesType, lang: string) => {
  const db = await database(lang);
  const result = await db.select(
    `SELECT * FROM ${resource} ORDER BY "created_at" DESC LIMIT 1`
  );
  const [model] = result as Book[];

  return model;
};
