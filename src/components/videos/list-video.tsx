"use client";

import { ChangeEvent, useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import VideoCard from "./video-card";
import { findAll } from "@/lib/resources/video";
import { resources } from "@/lib/resources";
import PaginationData from "../images/pagination-data";
import { useLangue } from "@/context/langue-context";
import { Video, VideoSearchParams } from "@/schemas/video";
import { LinksType, MetaType } from "@/schemas/sermon";
import { tr } from "@/translation";

export default function ListVideo() {
  const { lng } = useLangue();
  const [videos, setVideos] = useState<Array<Video> | undefined>(undefined);
  const [load, setLoad] = useState<boolean>(true);
  const [pagination, setPagination] = useState<{
    links?: LinksType;
    meta?: MetaType;
  }>();

  const [searchTerm, setSearchTerm] = useState("");
  const [searchParams, setSearchParams] = useState<VideoSearchParams>({
    per_page: 12,
    page: 1,
  });

  const getVideos = async () => {
    setLoad(true);
    const response = await findAll(resources.videos, lng, {
      search: searchParams.search as string,
      per_page: searchParams.per_page as number,
      current_page: searchParams.page as number,
    });
    setVideos(response.data);
    setLoad(false);
    setPagination({
      links: response.pagination.links,
      meta: response.pagination.meta,
    });
  };
  useEffect(() => {
    getVideos();
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

      <div className="bg-muted/100">
        <div className="max-w-6xl pl-4 pr-1 mx-auto relative">
          <div className="pt-20 ">
            {load && (
              <div className="flex justify-center items-center py-4 ">
                {tr("home.waiting")}
              </div>
            )}

            {videos &&
              videos.length > 0 &&
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-2">
              {videos &&
                videos.length > 0 &&
                videos.map((video) => (
                  <VideoCard
                    key={video.id}
                    title={video.title as string}
                    description={video.description}
                    url={video.url}
                  />
                ))}
            </div>

            {videos &&
              videos.length > 0 &&
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
        </div>
      </div>
    </>
  );
}
