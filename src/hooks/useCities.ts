import { useQuery } from "@tanstack/react-query";
import { findAll } from "@/lib/resources/city";
import { resources } from "@/lib/resources";

export function useCities(
  lng: string,
  countryId?: number,
  per_page: number = 1000
) {
  return useQuery({
    queryKey: ["cities", lng, countryId],
    queryFn: () =>
      findAll(
        resources.cities,
        lng,
        { country_id: countryId as number, per_page },
        { column: "order", direction: "ASC" }
      ),
    enabled: !!countryId,
  });
}
