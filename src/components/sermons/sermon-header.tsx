import { Sermon } from "@/schemas/sermon";
import { Input } from "../ui/input";
import { tr } from "@/translation";
import { ChangeEvent } from "react";
import SongPlayerManualButton from "../buttons/manual-player";
import { Printer } from "lucide-react";
import { pdf } from "@react-pdf/renderer";
import { SermonPrinter } from "./sermon-printer";
import { useLangue } from "@/context/langue-context";
import { writeFile } from "@tauri-apps/plugin-fs";
import { createPaths, DownloadBaseDir, openFile } from "@/lib/utils";

const SermonHeader = ({
  sermon,
  handleLocalSearch,
  search,
  fileIsDownload,
  setFinishedDownload,
  sermonImage,
}: {
  sermon: Sermon;
  search: string;
  fileIsDownload: boolean;
  setFinishedDownload: (fileIsDownload: boolean) => void;
  handleLocalSearch: (event: ChangeEvent<HTMLInputElement>) => void;
  sermonImage?: {
    name: string;
    blobUrl: string | null;
  };
}) => {
  async function handleDownload(sermon: any, lng: string) {
    const blob = await pdf(
      <SermonPrinter sermon={sermon} sermonImage={sermonImage} />
    ).toBlob();
    const arrayBuffer = await blob.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);

    const fileName = `${sermon.chapter}-${lng}`;

    //create filePath
    const filePath = await createPaths(lng, 'Sermons', fileName, 'pdf');

    await writeFile(filePath, uint8Array, { baseDir: DownloadBaseDir });
    await openFile(filePath)
  }

  const { lng } = useLangue();
  return (
    <>
      <div className="text-dark dark:text-white text-xl pb-2 italic bold">
        <div className="whitespace-nowrap">
          {`${sermon?.chapter} : ${sermon.title}`}
        </div>
      </div>
      <div className="flex items-center justify-end">
        <div className="flex justify-start items-center mr-4">
          {sermon.audio && (
            <SongPlayerManualButton
              setFinishedDownload={setFinishedDownload}
              type="Sermons"
              data={sermon}
              fileIsDownload={fileIsDownload}
            />
          )}
          <Printer
            onClick={() => handleDownload(sermon, lng)}
            className="cursor-pointer mx-2 text-pkp-ocean dark:text-white"
          ></Printer>
        </div>
        <Input
          type="text"
          placeholder={tr("button.search")}
          defaultValue={search}
          onChange={handleLocalSearch}
          className="border-pkp-ocean dark:border-white border-2 w-full outline-none"
        />
      </div>
    </>
  );
};

export default SermonHeader;
