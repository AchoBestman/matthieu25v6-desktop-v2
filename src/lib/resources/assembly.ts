import { ResourcesType } from "@/lib/resources";
import { DataType } from "@/types/sermon";
import { allModels, oneModel } from "@/lib/resources/base";
import { Assembly, AssemblySerchParams } from "@/types/assembly";
import { Head } from "@/types/brother";

export const findAll = async (
  resource: ResourcesType,
  lang: string,
  params?: AssemblySerchParams,
  order?: { column: string; direction: "ASC" | "DESC" }
): Promise<DataType<Assembly>> => {
  const conditions = [];
  const searchParams: any[] = [];
  if (params?.name) {
    conditions.push(`${resource}.name LIKE ?`);
    searchParams.push(`%${params.name}%`);
  }

  if (params?.city_id) {
    conditions.push(`${resource}.city_id = ?`);
    searchParams.push(params?.city_id);
  }

  if (params?.is_active !== undefined) {
    conditions.push(`${resource}.is_active = ?`);
    searchParams.push(params.is_active === true ? 1 : 0);
  }

  const whereClause = conditions.length
    ? `WHERE ${conditions.join(" AND ")}`
    : "";

  const countQuery = `
  SELECT COUNT(DISTINCT ${resource}.id) AS total
  FROM ${resource}
  ${whereClause}
`;

  const baseQuery = `
    SELECT *
    FROM ${resource}
  `;

  const response = await allModels<Assembly>(
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
): Promise<Head> => {
  const response = await oneModel<Head>(resource, lang, params, relationships);

  return response as Head;
};
