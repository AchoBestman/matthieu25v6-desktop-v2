import { Sermon } from "@/schemas/sermon";
import SongPlayerManualButton from "../buttons/manual-player";
import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { getLocalFilePath } from "@/lib/utils";
import { useLangue } from "@/context/langue-context";
import { SelectSermonType } from "./sermon-sidebar";
import { useSermon } from "@/context/sermon-context";

const SermonItem = ({
  sermon,
  setSelectedSermon,
  selectedSermon,
  finishedDownload,
  setFinishedDownload,
}: {
  sermon: Sermon;
  finishedDownload: boolean;
  selectedSermon: SelectSermonType;
  setSelectedSermon: (selectedSermon: SelectSermonType) => void;
  setFinishedDownload: (state: boolean) => void;
}) => {
  const [fileIsDownload, setFileIsDownload] = useState<boolean>(false);
  const navigate = useNavigate();
  const { lng } = useLangue();
  const { setVerseNumber } = useSermon();

  useEffect(() => {
    if (sermon) {
      getLocalFilePath(lng, "Sermons", `${sermon.chapter} : ${sermon.title}`)
        .then(() => {
          setFileIsDownload(true);
        })
        .catch(() => {
          setFileIsDownload(false);
        });
    }
    return () => {};
  }, [finishedDownload]);

  return (
    <div>
      <button
        type="button"
        onClick={() => {
          setSelectedSermon({
            ...selectedSermon,
            number: sermon.number.toString(),
            verse_number: "",
          });
          setVerseNumber("");
          navigate({ to: "/sermons" });
        }}
        className="cursor-pointer hover:bg-sidebar-accent hover:text-sidebar-accent-foreground flex flex-col items-start gap-2 px-2 pt-1 text-sm leading-tight whitespace-nowrap last:border-b-0 text-left w-full focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
      >
        <div className="flex w-full items-center gap-2">
          <span className="font-medium">{sermon.chapter}</span>{" "}
          <span className="ml-auto text-xs text-blue-600 dark:text-blue-400">
            {sermon.publication_date}
          </span>
        </div>
        <span className="line-clamp-2 font-medium w-[260px] whitespace-break-spaces">
          {sermon.title}
        </span>
        <span className="line-clamp-2 w-[260px] text-xs whitespace-break-spaces">
          {sermon.sub_title}
        </span>
      </button>
      <div className="flex justify-end mr-2 border-b pb-1 bg-red-500s">
        <SongPlayerManualButton
          setFinishedDownload={setFinishedDownload}
          type="Sermons"
          data={sermon}
          fileIsDownload={fileIsDownload}
        />
      </div>
    </div>
  );
};

export default SermonItem;
