import SelectWithSearch from "@/components/commons/select-with-search";
import { useLangue } from "@/context/langue-context";
import { resources } from "@/lib/resources";
import { findAll } from "@/lib/resources/song";
import { Album } from "@/schemas/album";
import { SelectEnum, SelectSearch } from "@/schemas/city";
import { SingList } from "@/schemas/song";
import { tr } from "@/translation";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { findAll as findAllAlbums } from "@/lib/resources/album";
import { SongDataTable } from "@/components/tables/songs/song-table";
import { songColumns } from "@/components/tables/songs/song-columns";

export const Route = createFileRoute("/hymns")({
  component: RouteComponent,
});

function RouteComponent() {
  const [select, setSelect] = useState<SelectSearch>({ id: 0, type: "" });
  const [albums, setAlbums] = useState<Array<Album>>();
  const [songs, setSongs] = useState<Array<SingList>>();
  const { lng } = useLangue();

  const [search, setSearch] = useState<string>("");
  const [albumId, setAlbumId] = useState<number | undefined>();

  const getAlbums = async () => {
    const response = await findAllAlbums(
      resources.albums,
      lng,
      { is_active: true, per_page: 10000 },
      { column: "order", direction: "ASC" }
    );

    setAlbums(response.data);
    setAlbumId(response.data[0].id);
  };

  const getSons = async (album_id?: number) => {
    const response = await findAll(
      resources.sings,
      lng,
      {
        is_active: true,
        per_page: 10000,
        search: search,
        album_id: album_id,
      },
      {
        column: "order",
        direction: "ASC",
      }
    );
    console.log(response.data, "songs");
    setSongs(response.data);
  };

  useEffect(() => {
    if (select.type === SelectEnum.singer) {
      setAlbumId(select.id);
    }
  }, [select, search]);

  useEffect(() => {
    getSons(albumId);
  }, [albumId]);

  useEffect(() => {
    getSons();
    setAlbumId(undefined);
  }, [search]);

  useEffect(() => {
    getAlbums();
  }, [lng]);

  return (
    <div>
      <div className="mt-1">
        <div className={`flex items-center justify-end my-5`}>
          {albums && albums.length > 0 && (
            <SelectWithSearch
              setSelect={setSelect}
              type={SelectEnum.singer}
              title={
                albumId
                  ? (albums.find((item) => item.id === albumId)
                      ?.title as string)
                  : tr("table.singers")
              }
              column="title"
              body={albums}
            />
          )}
        </div>
      </div>

      <div className="container mx-auto py-0">
        <SongDataTable
          columns={songColumns}
          data={songs}
          setSearch={setSearch}
          search={search}
        />
      </div>
    </div>
  );
}
