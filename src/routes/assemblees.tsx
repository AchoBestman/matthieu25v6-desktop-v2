import { useLangue } from "@/context/langue-context";
import { Assembly } from "@/schemas/assembly";
import { City, SelectEnum, SelectSearch } from "@/schemas/city";
import { Country } from "@/schemas/country";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { findAll as countries } from "@/lib/resources/country";
import { findAll as assemblies } from "@/lib/resources/assembly";
import { findAll as cities } from "@/lib/resources/city";
import { resources } from "@/lib/resources";
import { DataType } from "@/schemas/sermon";
import SelectWithSearch from "@/components/commons/select-with-search";
import { AssembliesDataTable } from "@/components/tables/assemblies/assemblies-table";
import { assembliesColumns } from "@/components/tables/assemblies/assemblies-columns";
import { tr } from "@/translation";

export const Route = createFileRoute("/assemblees")({
  component: RouteComponent,
});

function RouteComponent() {
  const [select, setSelect] = useState<SelectSearch>({ id: 0, type: "" });
  const [countriesData, setCountriesData] = useState<Array<Country>>();
  const [citiesData, setCitiesData] = useState<Array<City> | null>();
  const [assembliesList, setAssembliesList] = useState<Array<Assembly>>();
  const [defaultCountry, setDefaultCountry] = useState<Country | null>();
  const [defaultCity, setDefaultCity] = useState<City | null>();

  const { lng } = useLangue();

  const countriesList = async () => {
    countries(
      resources.countries,
      lng,
      { per_page: 1000 },
      { column: "order", direction: "ASC" }
    ).then((countries: DataType<Country>) => {
      setCountriesData(countries.data);
      setDefaultCountry(countries.data[0]);
      if (countries.data?.length > 0) {
        cities(
          resources.cities,
          lng,
          {
            country_id: countries.data[0].id,
            per_page: 1000,
          },
          { column: "order", direction: "ASC" }
        ).then((cities: DataType<City>) => {
          setCitiesData(cities.data);
          setDefaultCity(cities.data[0]);
          if (cities.data[0]) {
            assemblies(resources.assemblies, lng, {
              city_id: cities.data[0].id as number,
              per_page: 1000,
            }).then((assemblies: DataType<Assembly>) => {
              setAssembliesList(assemblies.data);
            });
          }
        });
      }
    });
  };

  const assembliesByCountryId = async (countryId: number) => {
    cities(resources.cities, lng, {
      country_id: countryId,
      per_page: 1000,
    }).then((cities: DataType<City>) => {
      setCitiesData(cities.data);
      setDefaultCity(cities.data[0]);
      if (cities.data[0]) {
        assemblies(resources.assemblies, lng, {
          city_id: cities.data[0].id as number,
          per_page: 1000,
        }).then((assemblies: DataType<Assembly>) => {
          setAssembliesList(assemblies.data);
        });
      }
    });
  };

  const assembliesByCityId = async (cityId: number) => {
    assemblies(resources.assemblies, lng, {
      city_id: cityId,
      per_page: 1000,
    }).then((assemblies: DataType<Assembly>) => {
      setAssembliesList(assemblies.data);
    });
  };

  useEffect(() => {
    if (select.type === SelectEnum.country) {
      assembliesByCountryId(select.id);
    }
    if (select.type === SelectEnum.city) {
      assembliesByCityId(select.id);
    }
    return () => {};
  }, [setSelect, select]);

  useEffect(() => {
    countriesList();
    return () => {};
  }, [lng]);

  return (
    <div>
      <div className="mt-1">
        <div className="flex items-center justify-end my-5">
          {countriesData && countriesData?.length > 0 && (
            <SelectWithSearch
              key={`country-select-${countriesData.length}`}
              setSelect={setSelect}
              type={SelectEnum.country}
              title={
                defaultCountry ? defaultCountry.name : tr("table.countries")
              }
              body={countriesData}
              column="name"
            />
          )}
          {citiesData && citiesData?.length > 0 && (
            <SelectWithSearch
              key={`city-select-${citiesData.length}`}
              setSelect={setSelect}
              type={SelectEnum.city}
              title={defaultCity ? defaultCity.libelle : tr("table.cities")}
              body={citiesData}
              column="libelle"
            />
          )}
        </div>
      </div>

      <div className="container mx-auto py-0">
        <AssembliesDataTable
          key={`assembly-${assembliesList?.length}`}
          columns={assembliesColumns}
          data={assembliesList ?? []}
        />
      </div>
    </div>
  );
}
