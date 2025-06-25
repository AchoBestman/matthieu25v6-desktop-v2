import { useQuery } from "@tanstack/react-query";
import { findAll } from "@/lib/resources/assembly";
import { resources } from "@/lib/resources";

export function useAssemblies(
  lng: string,
  cityId?: number,
  per_page: number = 1000,
  search?: string
) {
  return useQuery({
    queryKey: ["assemblies", lng, cityId, search, per_page],
    queryFn: () =>
      findAll(resources.assemblies, lng, {
        city_id: cityId,
        per_page,
        search,
      }),
    enabled: !!cityId,
  });
}
