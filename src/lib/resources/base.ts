import database from "@/lib/database";
import { resources, ResourcesType } from "@/lib/resources";
import { downloadDrogressType, toSingle } from "@/lib/utils";
import { DataType } from "@/schemas/sermon";

export const allModels = async <T>(
  lang: string,
  baseQuery: string,
  countQuery: string,
  searchParams: any[],
  conditions: string[],
  params?: { [key: string]: string | number | boolean | undefined },
  order?: { column: string; direction: "ASC" | "DESC" },
  groupBy?: string
): Promise<DataType<T>> => {
  const db = await database(lang);

  const countResult = await db.select<{ total: number }[]>(
    countQuery,
    searchParams
  );

  const [{ total }] = countResult;

  const perPage = params?.per_page ? parseInt(params.per_page.toString()) : 10;
  const page = params?.current_page
    ? parseInt(params.current_page.toLocaleString())
    : 1;
  const offset = (page - 1) * perPage;
  const totalPages = Math.ceil(total / perPage);

  if (conditions.length > 0) {
    baseQuery += ` WHERE ` + conditions.join(" AND ");
  }

  if (groupBy) {
    if (order) {
      baseQuery += `  ${groupBy} ORDER BY "${order.column}" ${order.direction} LIMIT ? OFFSET ?`;
    } else {
      baseQuery += ` ${groupBy} ORDER BY "id" DESC LIMIT ? OFFSET ?`;
    }
  } else {
    if (order) {
      baseQuery += `  ORDER BY "${order.column}" ${order.direction} LIMIT ? OFFSET ?`;
    } else {
      baseQuery += ` ORDER BY "id" DESC LIMIT ? OFFSET ?`;
    }
  }


  const result = await db.select(baseQuery, [...searchParams, perPage, offset]);
 
  return {
    data: result as T[],
    pagination: {
      meta: {
        total,
        perPage,
        currentPage: page,
        totalPages,
      },
      links: {
        first: page > 1 ? 1 : null,
        last: totalPages > 1 ? totalPages : null,
        prev: page > 1 ? page - 1 : null,
        next: page < totalPages ? page + 1 : null,
      },
    },
  };
};

export const oneModel = async <T>(
  resource: ResourcesType,
  lang: string,
  params: { column: string; value: string | number | boolean },
  relationships?: { table: string; type: "BelongsTo" | "HasOne" | "HasMany" }[],
  onProgress?: (percent: downloadDrogressType) => void
): Promise<T | T[]> => {
  const db = await database(lang, (percent) => {
    if (onProgress) {
      onProgress(percent);
    }
  });

  // 1. Get the model by ID
  const result = await db.select(
    `SELECT * FROM ${resource} WHERE ${params.column} = ?`,
    [params.value]
  );

  if (resource === resources.sings) {
    return result as T[];
  }

  const [model] = result as T[];

  if (!model) {
    throw new Error(
      `Model not found for ${resource} with ${params.column} = ${params.value}`
    );
  }

  const relationshipsFilterColumn = (column: string, type: string) =>
    type === "BelongsTo" ? "id" : `${toSingle(column)}_id`;
  const relationshipsFilterValueColumn = (column: string, type: string) =>
    type === "BelongsTo" ? `${toSingle(column)}_id` : "id";
  const relationshipsColumnInModel = (column: string, type: string) =>
    type === "BelongsTo" || type === "HasOne" ? toSingle(column) : column;

  const relationshipsValues = (result: any[], type: string) => {
    if (type === "BelongsTo" || type === "HasOne") {
      const [model] = result;
      return model;
    }
    return result;
  };
  //'num_verset', 'number'
  if (relationships && relationships.length > 0) {
    // 2. Load relationships if specified
    for (const relationship of relationships) {
      let relatedModels: [] = [];

      if (resource === resources.sermons) {
        relatedModels = await db.select(
          `
            SELECT verses.*, concordances.*
            FROM verses
            LEFT JOIN concordances
              ON verses.number = concordances.num_verset
              AND concordances.num_pred = ?
            WHERE verses.sermon_id = ?
            `,
          [
            (model as { [key: string]: number }).number,
            (model as { [key: string]: number }).id,
          ]
        );
      } else {
        relatedModels = await db.select(
          `SELECT * FROM ${relationship.table} WHERE ${relationshipsFilterColumn(
            resource,
            relationship.type
          )} = ?`,
          [
            (model as { [key: string]: number })[
              relationshipsFilterValueColumn(
                relationship.table,
                relationship.type
              )
            ],
          ]
        );
      }

      (model as any)[
        relationshipsColumnInModel(relationship.table, relationship.type)
      ] = relationshipsValues(relatedModels, relationship.type);
    }
  }

  return model;
};

export const totalModel = async (
  resource: ResourcesType,
  lang: string,
  onProgress?: (percent: downloadDrogressType) => void
): Promise<number> => {
  const db = await database(lang, (percent) => {
    if (onProgress) {
      onProgress(percent);
    }
  });
  const result = await db.select(`SELECT COUNT(*) as total FROM ${resource} `);
  return (result as any[])[0].total;
};
