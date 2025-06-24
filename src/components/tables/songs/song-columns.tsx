"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, PlusCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { getLocalFilePath } from "@/lib/utils";
import { SingList } from "@/schemas/song";
import { useLangue } from "@/context/langue-context";
import SongPlayerManualButton from "@/components/buttons/manual-player";
import SongModal from "@/components/dialog/song-modal";
import { tr } from "@/translation";

export default function Menu({ song }: Readonly<{ song: SingList }>) {
  const [open, setOpen] = useState<boolean>(false);
  const [songData, setSongData] = useState<SingList>(song);
  const onOpenChange = () => {
    setOpen(!open);
  };
  const [finishedDownload, setFinishedDownload] = useState<boolean>(false);
  const [fileIsDownload, setFileIsDownload] = useState<boolean>(false);
  const { lng } = useLangue();

  useEffect(() => {
    if (song) {
      setSongData(song);
    }

    getLocalFilePath(lng, "Hymns", song.title)
      .then(() => {
        setFileIsDownload(true);
        console.log(song.title, "song.title");
      })
      .catch(() => {});

    return () => {};
  }, [song, finishedDownload]);

  return (
    <div className="flex items-center">
      {songData.audio && (
        <SongPlayerManualButton
          setFinishedDownload={setFinishedDownload}
          type="Hymns"
          data={songData}
          fileIsDownload={fileIsDownload}
        />
      )}
      {songData.content && (
        <>
          <SongModal
            song={songData}
            cancel={true}
            open={open}
            onOpenChange={onOpenChange}
          />
          <PlusCircle
            onClick={() => {
              setOpen(true);
            }}
            className="mx-1 h-6 w-6 cursor-pointer text-primary dark:text-white"
          />
        </>
      )}
    </div>
  );
}

// Table columns definition
export const songColumns: ColumnDef<SingList>[] = [
  {
    accessorKey: "titre",
    cell: ({ row }) => {
      const original = row.original;
      return (
        <div className="w-75 whitespace-break-spaces">{original.title}</div>
      );
    },
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          {tr("table.titre")}
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const song = row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            {(song?.content || song?.audio) && <Menu song={song} />}
          </DropdownMenuTrigger>
        </DropdownMenu>
      );
    },
  },
];
