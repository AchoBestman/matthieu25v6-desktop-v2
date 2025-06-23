import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { downloadDrogressType } from "@/lib/utils";
import { tr } from "@/translation";
import { Delete } from "lucide-react";

const DownloadProgressModal = ({
  open,
  onOpenChange,
  title,
  progress,
  cancel,
  stopDownloading,
  type,
}: {
  open: boolean;
  onOpenChange: (value: boolean) => void;
  stopDownloading?: () => void;
  title: string;
  progress: downloadDrogressType;
  cancel?: boolean;
  type?: string;
}) => {
  return (
    <div>
      <AlertDialog open={open} onOpenChange={onOpenChange}>
        <AlertDialogContent className="border-amber-800 dark:border-white border-2">
          <AlertDialogHeader>
            <AlertDialogTitle className="italic text-sm">
              {progress.percent === 100
                ? tr("download.langue_is_downloaded")
                : title}
            </AlertDialogTitle>
            <div className="w-full italic">
              <div className="flex items-center space-x-2 w-full">
                <div className="relative flex-1 h-4 bg-gray-200 rounded overflow-hidden">
                  <div
                    className="bg-blue-600 h-full transition-all duration-300"
                    style={{ width: `${progress.percent}%` }}
                  />
                </div>
                {(!type || (type && type !== "appLoad")) && (
                  <Delete
                    className="text-red-500 cursor-pointer"
                    onClick={() => {
                      if (progress.percent !== 100) {
                        stopDownloading?.();
                        onOpenChange(false);
                      }
                    }}
                  />
                )}
              </div>
              <div className="flex my-2 justify-between">
                <div>{progress.percent}%</div>
                {progress.totalSize > 0 && (
                  <div className="mr-1">
                    {progress.downloadSize + "M"} / {progress.totalSize + "M"}
                  </div>
                )}
              </div>
            </div>
          </AlertDialogHeader>
          {(!type ||
            (type && type !== "appLoad") ||
            progress.percent === 100) && (
            <AlertDialogFooter>
              {cancel && (
                <AlertDialogCancel className="border-amber-800 italic dark:border-white border-2 cursor-pointer">
                  {tr("button.close")}
                </AlertDialogCancel>
              )}
            </AlertDialogFooter>
          )}
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default DownloadProgressModal;
