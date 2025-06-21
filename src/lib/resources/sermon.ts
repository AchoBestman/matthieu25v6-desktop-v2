import { ResourcesType } from "@/lib/resources";
import { DataType, parseConcordance, Sermon } from "@/types/sermon";
import { allModels, oneModel } from "@/lib/resources/base";
import { downloadDrogressType } from "../utils";

export const findAll = async <T>(
  resource: ResourcesType,
  lang: string,
  params?: { [key: string]: string | number | boolean },
  order?: { column: string; direction: "ASC" | "DESC" }
): Promise<DataType<T>> => {
  const baseQuery = `SELECT * FROM ${resource}`;
  let countQuery = `SELECT COUNT(*) as total FROM ${resource}`;
  const conditions = [];
  const searchParams: any[] = [];

  if (params?.search) {
    conditions.push(`(title LIKE ? OR chapter LIKE ?)`);
    searchParams.push(`%${params.search}%`, `%${params.search}%`);
  }

  if (params?.number) {
    conditions.push(`number = ?`);
    searchParams.push(params.number);
  }

  if (conditions.length > 0) {
    const whereClause = ` WHERE ` + conditions.join(" AND ");
    countQuery += whereClause;
  }

  const response = await allModels<T>(
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
  return {
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

        number: value.number,
        url_content: value.url_content,
      };
    }),
  };
};
