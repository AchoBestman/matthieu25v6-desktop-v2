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
import PrintButton from "@/components/buttons/print-button";

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
  return (
    <div>
      <AlertDialog open={open} onOpenChange={onOpenChange}>
        <AlertDialogContent className="border-2 border-amber-800 dark:border-white w-screen h-3/4 p-4 overflow-auto">
          <AlertDialogHeader className="">
            <AlertDialogTitle className="relative flex justify-between">
              <span className="text-border-amber-800 dark:text-white">
                {tr("home.hymns")}
              </span>
              <span className="flex">
                <PrintButton
                  elementId="song"
                  style={`
                  .song {line-height: 25px; text-align: justify;}
                   .print-number {font-size: 2em;} #song {margin-left: 100px; font-size: 30px;}
                   `}
                  documentTitle={song.title}
                >
                  <Printer className="cursor-pointer mx-2 text-border-amber-800 dark:text-white h-8"></Printer>
                </PrintButton>

                {cancel && (
                  <AlertDialogCancel className="h-8 border-border-amber-800 dark:border-white border-2">
                    {tr("button.close")}
                  </AlertDialogCancel>
                )}
              </span>
            </AlertDialogTitle>
            <AlertDialogDescription className="text-dark dark:text-white">
              <span id="song">
                <span className="flex justify-center items-center">
                  {song.title}
                  <span className="italic text-sm">{albumTitle}</span>
                </span>{" "}
                <br />
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
