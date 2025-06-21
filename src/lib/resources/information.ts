import { ResourcesType } from "@/lib/resources";
import { DataType } from "@/types/sermon";
import { allModels, oneModel } from "@/lib/resources/base";
import { Information } from "@/types/information";

export const findAll = async (
  resource: ResourcesType,
  lang: string,
  params?: { [key: string]: string | number | boolean },
  order?: { column: string; direction: "ASC" | "DESC" }
): Promise<DataType<Information>> => {
  const baseQuery = `SELECT * FROM ${resource}`;
  let countQuery = `SELECT COUNT(*) as total FROM ${resource}`;
  const conditions = [];
  const searchParams: any[] = [];

  if (params?.search) {
    conditions.push(`(title LIKE ?)`);
    searchParams.push(`%${params.search}%`);
  }

  if (params?.is_active !== undefined) {
    conditions.push(`is_active = ?`);
    searchParams.push(params.is_active === true ? 1 : 0);
  }

  if (conditions.length > 0) {
    const whereClause = ` WHERE ` + conditions.join(" AND ");
    countQuery += whereClause;
  }

  const response = await allModels<Information>(
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
  const response = await oneModel<Information>(
    resource,
    lang,
    params,
    relationships
  );

  const [model] = response as Information[];

  return model;
};
