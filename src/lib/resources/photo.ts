import { ResourcesType } from "@/lib/resources";
import { allModels, oneModel } from "@/lib/resources/base";
import { Photo } from "@/schemas/photo";
import { DataType } from "@/schemas/sermon";

export const findAll = async (
  resource: ResourcesType,
  lang: string,
  params?: { [key: string]: string | number | boolean },
  order?: { column: string; direction: "ASC" | "DESC" }
): Promise<DataType<Photo>> => {
  const baseQuery = `SELECT * FROM ${resource}`;
  let countQuery = `SELECT COUNT(*) as total FROM ${resource}`;
  const conditions = [];
  const searchParams: any[] = [];

  if (params?.search) {
    conditions.push(`(title LIKE ? OR description LIKE ?)`);
    searchParams.push(`%${params.search}%`, `%${params.search}%`);
  }

  if (params?.page) {
    params.current_page = params.page;
  }

  if (params?.is_active !== undefined) {
    conditions.push(`is_active = ?`);
    searchParams.push(params.is_active === true ? 1 : 0);
  }

  if (params?.event_id) {
    conditions.push(`event_id = ?`);
    searchParams.push(params.event_id);
  }
  if (params?.event_id) {
    conditions.push(`event_id = ?`);
    searchParams.push(params.event_id);
  }

  if (conditions.length > 0) {
    const whereClause = ` WHERE ` + conditions.join(" AND ");
    countQuery += whereClause;
  }

  const response = await allModels<Photo>(
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
  const response = await oneModel<Photo>(resource, lang, params, relationships);

  const [model] = response as Photo[];

  return model;
};
