import { ResourcesType } from "@/lib/resources";
import { DataType } from "@/types/sermon";
import { allModels, oneModel } from "@/lib/resources/base";
import { toSingle } from "@/lib/utils";
import database from "@/lib/database";
import { BrotherList, Head, Ministre, Singer } from "@/types/brother";

export const findAll = async (
  resource: ResourcesType,
  lang: string,
  params?: { [key: string]: string | number | boolean },
  order?: { column: string; direction: "ASC" | "DESC" }
): Promise<DataType<BrotherList>> => {
  const conditions = [];
  const searchParams: any[] = [];
  const joins: string[] = [];

  if (params?.phone) {
    conditions.push(`${resource}.phone LIKE ?`);
    searchParams.push(`%${params.phone}%`);
  }

  if (params?.email) {
    conditions.push(`${resource}.email LIKE ?`);
    searchParams.push(`%${params.email}%`);
  }

  if (params?.full_name) {
    conditions.push(`${resource}.full_name LIKE ?`);
    searchParams.push(`%${params.full_name}%`);
  }

  if (params?.is_singer) {
    joins.push(
      `INNER JOIN singers ON singers.${toSingle(resource)}_id = ${resource}.id`
    );
    if (params?.country_id) {
      conditions.push(`singers.country_id = ?`);
      searchParams.push(params.country_id);
    }
  }

  if (params?.is_head) {
    joins.push(
      `INNER JOIN heads ON heads.${toSingle(resource)}_id = ${resource}.id`
    );
    if (params?.country_id) {
      conditions.push(`heads.country_id = ?`);
      searchParams.push(params.country_id);
    }
    if (params?.assembly_id) {
      conditions.push(`heads.assembly_id = ?`);
      searchParams.push(params.assembly_id);
    }
  }

  if (params?.is_minister) {
    joins.push(
      `INNER JOIN ministres ON ministres.${toSingle(resource)}_id = ${resource}.id`
    );
    if (params?.country_id) {
      conditions.push(`ministres.country_id = ?`);
      searchParams.push(params.country_id);
    }
    if (params?.assembly_id) {
      conditions.push(`ministres.assembly_id = ?`);
      searchParams.push(params.assembly_id);
    }
  }

  const joinClause = joins.join(" ");
  const whereClause = conditions.length
    ? `WHERE ${conditions.join(" AND ")}`
    : "";

  const countQuery = `
  SELECT COUNT(DISTINCT ${resource}.id) AS total
  FROM ${resource}
  ${joinClause}
  ${whereClause}
`;

  const baseQuery = `
  SELECT DISTINCT ${resource}.*
  FROM ${resource}
  ${joinClause}
`;

  const response = await allModels<BrotherList>(
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
  const response = await oneModel<BrotherList>(
    resource,
    lang,
    params,
    relationships
  );
  const [model] = response as BrotherList[];
  const db = await database(lang);
  // 2. Get heads with country and assembly->city
  const heads = await db.select<Array<Head>>(
    `
  SELECT 
    heads.*,
    JSON_OBJECT(
      'id', countries.id,
      'name', countries.name,
      'sigle', countries.sigle
    ) AS country,
    JSON_OBJECT(
      'id', assemblies.id,
      'name', assemblies.name,
      'address', assemblies.address,
      'localisation', assemblies.localisation,
      'city', JSON_OBJECT(
        'id', cities.id,
        'libelle', cities.libelle,
        'description', cities.description
      )
    ) AS assembly
  FROM heads
  LEFT JOIN countries ON heads.country_id = countries.id
  LEFT JOIN assemblies ON heads.assembly_id = assemblies.id
  LEFT JOIN cities ON assemblies.city_id = cities.id
  WHERE heads.brother_id = ?
  `,
    [model.id]
  );

  // 3. Get singer with country
  const singer = await db.select<Array<Singer>>(
    `
    SELECT singers.*,
    JSON_OBJECT(
      'id', countries.id,
      'name', countries.name,
      'sigle', countries.sigle
    ) AS country
    FROM singers
    LEFT JOIN countries ON singers.country_id = countries.id
    WHERE singers.brother_id = ?
    `,
    [model.id]
  );

  // 4. Get ministres with country and assembly->city
  const ministres = await db.select<Array<Ministre>>(
    `
    SELECT ministres.*,
    JSON_OBJECT(
      'id', countries.id,
      'name', countries.name,
      'sigle', countries.sigle
    ) AS country,
    JSON_OBJECT(
      'id', assemblies.id,
      'name', assemblies.name,
      'address', assemblies.address,
      'localisation', assemblies.localisation,
      'city', JSON_OBJECT(
        'id', cities.id,
        'libelle', cities.libelle,
        'description', cities.description
      )
    ) AS assembly
    FROM ministres
    LEFT JOIN countries ON ministres.country_id = countries.id
    LEFT JOIN assemblies ON ministres.assembly_id = assemblies.id
    LEFT JOIN cities ON assemblies.city_id = cities.id
    WHERE ministres.brother_id = ?
    `,
    [model.id]
  );

  // 5. Compose the final object manually
  const fullData = {
    ...response,
    heads: heads.map((row) => ({
      ...row,
      country: JSON.parse(row.country.toString()),
      assembly: JSON.parse(row.assembly.toString()),
    })),
    singer:
      singer && singer.length > 0
        ? { ...singer[0], country: JSON.parse(singer[0].country.toString()) }
        : null,
    ministres: ministres.map((row) => ({
      ...row,
      country: JSON.parse(row.country.toString()),
      assembly: JSON.parse(row.assembly.toString()),
    })),
  };

  return fullData;
};
