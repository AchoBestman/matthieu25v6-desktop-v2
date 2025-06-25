import { useQuery } from "@tanstack/react-query";
import { findAll } from "@/lib/resources/song";
import { resources } from "@/lib/resources";

export function useSongs(
  lng: string,
  albumId?: number,
  per_page: number = 100,
  search?: string
) {
  return useQuery({
    queryKey: ["songs", lng, albumId, search, per_page],
    queryFn: () =>
      findAll(
        resources.sings,
        lng,
        {
          is_active: true,
          album_id: albumId,
          search,
          per_page,
        },
        { column: "order", direction: "ASC" }
      ),
    enabled: !!lng,
  });
}
