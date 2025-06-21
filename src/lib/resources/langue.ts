import { ResourcesType } from "@/lib/resources";
import { DataType } from "@/types/sermon";
import { allModels, oneModel } from "@/lib/resources/base";
import { Langue } from "@/types/langue";

export const findAll = async (
  resource: ResourcesType,
  lang: string,
  params?: { [key: string]: string | number | boolean },
  order?: { column: string; direction: "ASC" | "DESC" }
): Promise<DataType<Langue>> => {
  const baseQuery = `SELECT * FROM ${resource}`;
  let countQuery = `SELECT COUNT(*) as total FROM ${resource}`;
  const conditions = [];
  const searchParams: any[] = [];

  if (params?.search) {
    conditions.push(`(libelle LIKE ? OR initial LIKE ?)`);
    searchParams.push(`%${params.search}%`, `%${params.search}%`);
  }

  if (params?.is_active !== undefined) {
    conditions.push(`is_active = ?`);
    searchParams.push(params.is_active === true ? 1 : 0);
  }

  if (params?.web_translation) {
    conditions.push(`web_translation IS NOT NULL`);
  }

  if (conditions.length > 0) {
    const whereClause = ` WHERE ` + conditions.join(" AND ");
    countQuery += whereClause;
  }

  const response = await allModels<Langue>(
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
  const response = await oneModel<Langue>(
    resource,
    lang,
    params,
    relationships
  );

  const [model] = response as Langue[];

  return model;
};
