import { useQuery } from "@tanstack/react-query";
import { findAll } from "@/lib/resources/country";
import { resources } from "@/lib/resources";

export function useCountries(lng: string, per_page: number = 1000) {
  return useQuery({
    queryKey: ["countries", lng, per_page],
    queryFn: () =>
      findAll(
        resources.countries,
        lng,
        { per_page },
        { column: "order", direction: "ASC" }
      ),
  });
}
