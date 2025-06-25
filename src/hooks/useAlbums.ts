import { useQuery } from "@tanstack/react-query";
import { findAll } from "@/lib/resources/album";
import { resources } from "@/lib/resources";
import { Album } from "@/schemas/album";
import { DataType } from "@/schemas/sermon";

export function useAlbums(lng: string, per_page: number = 1000) {
  return useQuery({
    queryKey: ["albums", lng],
    queryFn: () =>
      findAll(
        resources.albums,
        lng,
        { is_active: true, per_page },
        { column: "order", direction: "ASC" }
      ) as Promise<DataType<Album>>,
  });
}
