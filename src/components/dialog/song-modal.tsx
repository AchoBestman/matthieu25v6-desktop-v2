import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { SingList } from "@/schemas/song";
import { tr } from "@/translation";
import { Printer } from "lucide-react";
import { useSermon } from "@/context/sermon-context";
import { pdf } from "@react-pdf/renderer";
import { SongPrinter } from "../tables/songs/song-printer";
import { writeFile, BaseDirectory } from "@tauri-apps/plugin-fs";
import { handleConfirmAlert } from "@/lib/alert-confirm-options";
import slug from "slug";

const SongModal = ({
  open,
  onOpenChange,
  song,
  cancel,
  albumTitle,
}: {
  open: boolean;
  song: SingList;
  onOpenChange: (value: boolean) => void;
  cancel?: boolean;
  albumTitle?: string;
}) => {
  const { fontSize } = useSermon();
//console.log("Rendering SongModal with song:", song);
  async function handleDownload() {

    onOpenChange(false)
    const blob = await pdf(
      <SongPrinter song={song} albumTitle={albumTitle} />
    ).toBlob();
    const arrayBuffer = await blob.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);

    const fileName = `${slug(song.title)}-${slug(albumTitle ?? "")}.pdf`;

    await writeFile(fileName, uint8Array, { baseDir: BaseDirectory.Download });
    handleConfirmAlert(
      tr("download.pdf_download_message"),
      true,
      undefined,
      tr("download.pdf_download_title")
    );
  }

  return (
    <div>
      <AlertDialog open={open} onOpenChange={onOpenChange}>
        <AlertDialogContent className="border-2 border-amber-800 dark:border-white w-screen h-3/4 p-4 overflow-auto">
          <AlertDialogHeader className="">
            <AlertDialogTitle className="relative flex justify-between">
              <span className="text-border-amber-800 dark:text-white">
                {song.album?.title ?? tr("home.hymns")}
              </span>
              <span className="flex">
                <Printer
                  onClick={() => handleDownload()}
                  className="cursor-pointer mx-2 text-amber-800 dark:text-white"
                ></Printer>
                {/* <PrintButton
                  elementId="song"
                  style={`
                  .song {line-height: 25px; text-align: justify;}
                   .print-number {font-size: 2em;} #song {margin-left: 100px; font-size: 30px;}
                   `}
                  documentTitle={song.title}
                >
                  <Printer className="cursor-pointer mx-2 text-border-amber-800 dark:text-white h-8"></Printer>
                </PrintButton> */}

                {cancel && (
                  <AlertDialogCancel className="h-8 border-border-amber-800 dark:border-white border-2">
                    {tr("button.close")}
                  </AlertDialogCancel>
                )}
              </span>
            </AlertDialogTitle>
            <AlertDialogDescription className="text-dark dark:text-white">
              <span id="song" style={{ fontSize }}>
                {/* <span className="flex-row justify-center items-center">
                  {song.album?.title}
                  <span className="italic text-sm">{albumTitle}</span>
                </span>
                <br /> */}
                {song.content && (
                  <span
                    dangerouslySetInnerHTML={{
                      __html: song.content?.replace(/\n/g, "<br>"),
                    }}
                  ></span>
                )}
              </span>
            </AlertDialogDescription>
          </AlertDialogHeader>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default SongModal;
