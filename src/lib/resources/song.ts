import { ResourcesType } from "@/lib/resources";
import { DataType } from "@/types/sermon";
import { allModels, oneModel } from "@/lib/resources/base";
import { SingList } from "@/types/sing";
import database from "../database";

export const findAll = async (
  resource: ResourcesType,
  lang: string,
  params?: { [key: string]: string | number | boolean | undefined },
  order?: { column: string; direction: "ASC" | "DESC" }
): Promise<DataType<SingList>> => {
  const baseQuery = `SELECT * FROM ${resource}`;
  let countQuery = `SELECT COUNT(*) as total FROM ${resource}`;
  const conditions = [];
  const searchParams: any[] = [];

  if (params?.search) {
    conditions.push(`(title LIKE ? OR content LIKE ?)`);
    searchParams.push(`%${params.search}%`, `%${params.search}%`);
  }

  if (params?.album_id) {
    conditions.push(`${resource}.album_id = ?`);
    searchParams.push(params?.album_id);
  }

  if (params?.is_active !== undefined) {
    conditions.push(`is_active = ?`);
    searchParams.push(params.is_active === true ? 1 : 0);
  }

  if (conditions.length > 0) {
    const whereClause = ` WHERE ` + conditions.join(" AND ");
    countQuery += whereClause;
  }

  const response = await allModels<SingList>(
    lang,
    baseQuery,
    countQuery,
    searchParams,
    conditions,
    params,
    order
  );

  return response;
};

export const findBy = async (
  resource: ResourcesType,
  lang: string,
  params: { column: string; value: string | number | boolean },
  relationships?: { table: string; type: "BelongsTo" | "HasOne" | "HasMany" }[]
) => {
  const response = await oneModel<SingList>(
    resource,
    lang,
    params,
    relationships
  );

  const [model] = response as SingList[];

  return model;
};

export const findPreviousSong = async (
  lang: string,
  id: number,
  album_id?: number
) => {
  const db = await database(lang);
  let result;
  if (album_id) {
    result = await db.select(
      `SELECT * FROM sings
     WHERE album_id = ? AND "order" < (
       SELECT "order" FROM sings WHERE id = ? AND album_id = ?
     )
     ORDER BY "order" DESC
     LIMIT 1;`,
      [album_id, id, album_id]
    );
  } else {
    result = await db.select(
      `SELECT * FROM sermons
       WHERE "number" < (
       SELECT "number" FROM sermons WHERE id = ?
     )
     ORDER BY "number" DESC
     LIMIT 1;`,
      [id]
    );
  }

  return result;
};

export const findNextSong = async (
  lang: string,
  id: number,
  album_id?: number
) => {
  const db = await database(lang);
  console.log(lang, "next");
  let result;
  if (album_id) {
    result = await db.select(
      `SELECT * FROM sings
       WHERE album_id = ? AND "order" > (
         SELECT "order" FROM sings WHERE id = ? AND album_id = ?
       )
       ORDER BY "order" ASC
       LIMIT 1;`,
      [album_id, id, album_id]
    );
  } else {
    result = await db.select(
      `SELECT * FROM sermons
         WHERE "number" > (
         SELECT "number" FROM sermons WHERE id = ?
       )
       ORDER BY "number" ASC
       LIMIT 1;`,
      [id]
    );
  }
  console.log(result, "result");
  return result;
};
