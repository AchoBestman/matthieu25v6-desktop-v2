"use client";

import { ChangeEvent, useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { findAll } from "@/lib/resources/photo";
import { resources } from "@/lib/resources";
import PhotoCard from "./photo-card";
import PaginationData from "./pagination-data";
import { useLangue } from "@/context/langue-context";
import { LinksType, MetaType } from "@/schemas/sermon";
import { tr } from "@/translation";
import { Photo, PhotoSearchParams } from "@/schemas/photo";

export default function ListPhoto() {
  const { lng } = useLangue();
  const [photos, setPhotos] = useState<Array<Photo> | undefined>(undefined);
  const [load, setLoad] = useState<boolean>(true);
  const [pagination, setPagination] = useState<{
    links?: LinksType;
    meta?: MetaType;
  }>();

  const [searchTerm, setSearchTerm] = useState("");
  const [searchParams, setSearchParams] = useState<PhotoSearchParams>({
    per_page: 12,
    page: 1,
  });

  const getPhotos = async () => {
    setLoad(true);
    const response = await findAll(resources.photos, lng, {
      search: searchParams.search as string,
      per_page: searchParams.per_page as number,
      current_page: searchParams.page as number,
    });

    setPhotos(response.data);
    setLoad(false);
    setPagination({
      links: response.pagination.links,
      meta: response.pagination.meta,
    });
  };
  useEffect(() => {
    getPhotos();
  }, [setSearchParams, searchParams]);

  useEffect(() => {
    setSearchParams({ search: searchTerm });
  }, [searchTerm, setSearchTerm]);

  // Gérer la recherche
  const handleSearch = (event: ChangeEvent<HTMLInputElement>) => {
    const term = event.target.value;
    setSearchTerm(term);
  };

  return (
    <>
      <div className="w-full fixed z-40 bg-muted/100 -mt-8 pb-2">
        <div className="mt-4 w-8/12">
          <Input
            type="text"
            placeholder={tr("button.search") + "..."}
            value={searchTerm}
            onChange={handleSearch}
            className="border-primary dark:border-white border-2 outline-none"
          />
        </div>
      </div>

      <div className="mt-10">
        {load && (
          <div className="flex justify-center items-center py-4 ">
            {tr("home.waiting")}
          </div>
        )}

        {photos &&
          photos.length > 0 &&
          pagination?.links &&
          pagination?.meta &&
          pagination.meta.total > 10 && (
            <div className="py-4 pt-5">
              <PaginationData
                pagination={pagination}
                setSearchParams={setSearchParams}
              />
            </div>
          )}

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-2">
          {photos &&
            photos.length > 0 &&
            photos.map((photo) => (
              <PhotoCard
                key={photo.id}
                title={photo.title as string}
                description={photo.description}
                url={photo.url}
              />
            ))}
        </div>

        {photos &&
          photos.length > 0 &&
          pagination?.links &&
          pagination?.meta && (
            <div className="py-4 pt-5">
              <PaginationData
                pagination={pagination}
                setSearchParams={setSearchParams}
              />
            </div>
          )}
      </div>
    </>
  );
}
