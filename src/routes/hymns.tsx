import SelectWithSearch from "@/components/commons/select-with-search";
import { useLangue } from "@/context/langue-context";
import { SelectEnum, SelectSearch } from "@/schemas/city";
import { tr } from "@/translation";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { SongDataTable } from "@/components/tables/songs/song-table";
import { songColumns } from "@/components/tables/songs/song-columns";
import { useAlbums } from "@/hooks/useAlbums";
import { useSongs } from "@/hooks/useSongs";
import PageLoader from "@/components/loaders/page-loader";
import { useDebounce } from "use-debounce";

export const Route = createFileRoute("/hymns")({
  component: RouteComponent,
});

function RouteComponent() {
  const { lng } = useLangue();

  const [select, setSelect] = useState<SelectSearch>({ id: 0, type: "" });
  const [search, setSearch] = useState<string>("");

  const { data: albumsData } = useAlbums(lng);
  const albumId = select.type === SelectEnum.singer ? select.id : undefined;

  const defaultAlbum = albumsData?.data?.[0];
  const selectedAlbumId = albumId ?? defaultAlbum?.id;
  const [searchTermDebounce] = useDebounce(search, 1000);

  const {
    data: songsData,
    isError,
    isLoading,
  } = useSongs(lng, selectedAlbumId, undefined, searchTermDebounce);

  return (
    <div className="">
      <div
        className={`sticky top-16 w-full -mt-4 h-20 px-2 py-2 bg-pkp-sand dark:bg-gray-800 z-1`}
      >
        <div className="flex items-center justify-end my-5">
          {albumsData?.data && albumsData.data.length > 0 && (
            <SelectWithSearch
              key={`select-albums-${albumsData.data.length}`}
              setSelect={setSelect}
              type={SelectEnum.singer}
              title={
                selectedAlbumId
                  ? (albumsData.data.find((a) => a.id === selectedAlbumId)
                      ?.title as string)
                  : tr("table.singers")
              }
              column="title"
              body={albumsData.data}
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
        isLoading={!songsData?.data || isLoading || isError}
      >
        <div className="container mx-auto py-0 mt-10">
          <SongDataTable
            columns={songColumns}
            data={songsData?.data ?? []}
            setSearch={setSearch}
            search={search}
          />
        </div>
      </PageLoader>
    </div>
  );
}
