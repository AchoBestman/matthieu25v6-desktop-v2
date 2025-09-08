"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { findAll } from "@/lib/resources/photo";
import { resources } from "@/lib/resources";
import PhotoCard from "./photo-card";
import PaginationData from "./pagination-data";
import { useLangue } from "@/context/langue-context";
import { tr } from "@/translation";
import { Photo, PhotoSearchParams } from "@/schemas/photo";
import { useDebounce } from "use-debounce";
import { useQuery } from "@tanstack/react-query";
import PageLoader from "@/components/loaders/page-loader";

export default function ListPhoto() {
  const { lng } = useLangue();
  const [searchTerm, setSearchTerm] = useState("");
  const [searchParams, setSearchParams] = useState<PhotoSearchParams>({
    per_page: 12,
    page: 1,
  });

  const [searchTermDebounce] = useDebounce(searchTerm, 300);

  const {
    data: photos,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["photos", lng, searchParams, searchTermDebounce],
    queryFn: () =>
      findAll(resources.photos, lng, {
        ...searchParams,
        search: searchTermDebounce,
      }),
  });
console.log(photos, "photos");
  return (
    <>
      <div
        className={`sticky top-16 w-full -mt-12 h-15 px-2 py-2 bg-muted z-1`}
      >
        <Input
          type="text"
          placeholder={tr("button.search") + "..."}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border-amber-800 dark:border-white border-2 outline-none"
        />
      </div>
      <PageLoader
        loadMessage={
          isLoading
            ? tr("home.waiting")
            : tr("home.search_not_found_pred_message")
        }
        isLoading={!photos?.data || isLoading || isError}
      >
        <div className="bg-muted/100 pl-4 pr-1 pt-12">
          {photos && photos.pagination?.meta?.total > 10 && (
            <div className="py-4 pt-5">
              <PaginationData
                pagination={{
                  links: photos.pagination.links,
                  meta: photos.pagination.meta,
                }}
                setSearchParams={setSearchParams}
              />
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-2">
            {photos?.data.map((video: Photo) => (
              <PhotoCard
                key={video.id}
                title={video.title as string}
                description={video.description}
                url={video.url}
              />
            ))}
          </div>

          {photos?.pagination?.meta && (
            <div className="py-4 pt-5">
              <PaginationData
                pagination={{
                  links: photos.pagination.links,
                  meta: photos.pagination.meta,
                }}
                setSearchParams={setSearchParams}
              />
            </div>
          )}
        </div>
      </PageLoader>
    </>
  );
}
