import { ResourcesType } from "@/lib/resources";
import { allModels, oneModel } from "@/lib/resources/base";
import { Assembly, AssemblySerchParams } from "@/schemas/assembly";
import { SingleHead } from "@/schemas/brother";
import { DataType } from "@/schemas/sermon";

export const findAll = async (
  resource: ResourcesType,
  lang: string,
  params?: AssemblySerchParams,
  order?: { column: string; direction: "ASC" | "DESC" }
): Promise<DataType<Assembly>> => {
  const conditions = [];
  const searchParams: any[] = [];
  if (params?.search) {
    conditions.push(`${resource}.name LIKE ?`);
    searchParams.push(`%${params.search}%`);
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
): Promise<SingleHead> => {
  const response = await oneModel<SingleHead>(
    resource,
    lang,
    params,
    relationships
  );

  return response as SingleHead;
};
