import { useLangue } from "@/context/langue-context";
import { SelectEnum, SelectSearch } from "@/schemas/city";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
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
  const [select, setSelect] = useState<SelectSearch>({ id: 0, type: "" });
  const [search, setSearch] = useState<string>("");
  const { data: countriesData, isSuccess: countriesLoaded } = useCountries(lng);

  const defaultCountry = countriesData?.data?.[0];
  const countryId =
    select.type === SelectEnum.country ? select.id : defaultCountry?.id;

  const { data: citiesData, isSuccess: citiesLoaded } = useCities(
    lng,
    countryId
  );

  const defaultCity = citiesData?.data?.[0];
  const cityId = select.type === SelectEnum.city ? select.id : defaultCity?.id;

  const [searchTermDebounce] = useDebounce(search, 300);

  const {
    data: assembliesData,
    isError,
    isLoading,
  } = useAssemblies(lng, cityId, undefined, searchTermDebounce);

  return (
    <div>
      <div
        className={`sticky top-16 w-full -mt-4 h-20 px-2 py-2 bg-muted z-1`}
      >
        <div className="flex items-center justify-end my-5">
          {countriesLoaded && countriesData.data.length > 0 && (
            <SelectWithSearch
              key={`country-select-${countriesData.data.length}`}
              setSelect={setSelect}
              type={SelectEnum.country}
              title={defaultCountry?.name ?? tr("table.countries")}
              body={countriesData.data}
              column="name"
            />
          )}

          {citiesLoaded && citiesData.data.length > 0 && (
            <SelectWithSearch
              key={`city-select-${citiesData.data.length}`}
              setSelect={setSelect}
              type={SelectEnum.city}
              title={defaultCity?.libelle ?? tr("table.cities")}
              body={citiesData.data}
              column="libelle"
            />
          )}
        </div>
      </div>

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
  );
}
