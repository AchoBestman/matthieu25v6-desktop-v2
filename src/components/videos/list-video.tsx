"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import VideoCard from "./video-card";
import { findAll } from "@/lib/resources/video";
import { resources } from "@/lib/resources";
import PaginationData from "../images/pagination-data";
import { useLangue } from "@/context/langue-context";
import { Video, VideoSearchParams } from "@/schemas/video";
import { tr } from "@/translation";
import PageLoader from "../loaders/page-loader";
import { useQuery } from "@tanstack/react-query";
import { useDebounce } from "use-debounce";

export default function ListVideo() {
  const { lng } = useLangue();
  const [searchTerm, setSearchTerm] = useState("");
  const [searchParams, setSearchParams] = useState<VideoSearchParams>({
    per_page: 12,
    page: 1,
  });

  const [searchTermDebounce] = useDebounce(searchTerm, 300);

  const {
    data: videos,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["videos", lng, searchParams, searchTermDebounce],
    queryFn: () =>
      findAll(resources.videos, lng, {
        ...searchParams,
        search: searchTermDebounce,
      }),
  });

  return (
    <>
      <div
        className={`sticky top-16 w-full -mt-12 h-15 px-2 py-2 bg-muted z-20`}
      >
        <Input
          type="text"
          placeholder={tr("button.search") + "..."}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border-primary dark:border-white border-2 outline-none"
        />
      </div>
      <PageLoader
        loadMessage={
          isLoading
            ? tr("home.waiting")
            : tr("home.search_not_found_pred_message")
        }
        isLoading={!videos?.data || isLoading || isError}
      >
        <div className="bg-muted/100 pl-4 pr-1 pt-12">
          {videos && videos.pagination?.meta?.total > 10 && (
            <div className="py-4 pt-5">
              <PaginationData
                pagination={{
                  links: videos.pagination.links,
                  meta: videos.pagination.meta,
                }}
                setSearchParams={setSearchParams}
              />
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-2">
            {videos?.data.map((video: Video) => (
              <VideoCard
                key={video.id}
                title={video.title as string}
                description={video.description}
                url={video.url}
              />
            ))}
          </div>

          {videos?.pagination?.meta && (
            <div className="py-4 pt-5">
              <PaginationData
                pagination={{
                  links: videos.pagination.links,
                  meta: videos.pagination.meta,
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
