import { useLangue } from "@/context/langue-context";
import { SelectEnum } from "@/schemas/city";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import SelectWithSearch from "@/components/commons/select-with-search";
import { AssembliesDataTable } from "@/components/tables/assemblies/assemblies-table";
import { assembliesColumns } from "@/components/tables/assemblies/assemblies-columns";
import { tr } from "@/translation";
import { useCountries } from "@/hooks/useCountries";
import { useCities } from "@/hooks/useCities";
import { useAssemblies } from "@/hooks/useAssemblies";
import { useDebounce } from "use-debounce";
import PageLoader from "@/components/loaders/page-loader";

export const Route = createFileRoute("/assemblees")({
  component: RouteComponent,
});

function RouteComponent() {
  const { lng } = useLangue();
  const [search, setSearch] = useState<string>("");
  const [countryId, setCountryId] = useState<number | undefined>(undefined);
  const [cityId, setCityId] = useState<number | undefined>(undefined);

  const { data: countriesData, isSuccess: countriesLoaded } = useCountries(lng);

  useEffect(() => {
    if (countriesLoaded && countriesData?.data?.length && !countryId) {
      setCountryId(countriesData.data[0].id);
    }
  }, [countriesLoaded, countriesData, countryId]);

  const { data: citiesData, isSuccess: citiesLoaded } = useCities(
    lng,
    countryId
  );

  useEffect(() => {
    if (citiesLoaded && citiesData?.data?.length && !cityId) {
      setCityId(citiesData.data[0].id);
    }
  }, [citiesLoaded, citiesData, cityId]);

  // 5. Gestion recherche
  const [searchTermDebounce] = useDebounce(search, 300);

  const {
    data: assembliesData,
    isError,
    isLoading,
  } = useAssemblies(lng, cityId, undefined, searchTermDebounce);

  return (
    <div>
      <div className={`sticky top-16 w-full -mt-4 h-20 px-2 py-2 bg-muted z-1`}>
        <div className="flex items-center justify-end my-5">
          {countriesLoaded && countriesData.data.length > 0 && (
            <SelectWithSearch
              setSelect={(sel) => {
                if (sel.type === SelectEnum.country) {
                  setCountryId(sel.id);
                  setCityId(undefined); // reset la ville quand le pays change
                }
              }}
              type={SelectEnum.country}
              title={
                countriesData.data.find((c) => c.id === countryId)?.name ??
                tr("table.countries")
              }
              body={countriesData.data}
              column="name"
            />
          )}

          {citiesLoaded && citiesData.data.length > 0 && (
            <SelectWithSearch
              setSelect={(sel) => {
                if (sel.type === SelectEnum.city) {
                  setCityId(sel.id);
                }
              }}
              type={SelectEnum.city}
              title={
                citiesData.data.find((c) => c.id === cityId)?.libelle ??
                tr("table.cities")
              }
              body={citiesData.data}
              column="libelle"
            />
          )}
        </div>
      </div>

      <div className="mt-4">
        <PageLoader
          loadMessage={
            isLoading
              ? tr("home.waiting")
              : tr("home.search_not_found_pred_message")
          }
          isLoading={!assembliesData?.data || isLoading || isError}
        >
          <div className="container mx-auto py-0 mt-10">
            <AssembliesDataTable
              key={`assembly-${assembliesData?.data.length}`}
              columns={assembliesColumns}
              data={assembliesData?.data ?? []}
              setSearch={setSearch}
              search={search}
            />
          </div>
        </PageLoader>
      </div>
    </div>
  );
}
