"use client";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { AudioFolder, cancelDownload, createPaths, downloadDrogressType, FileExtension, startDownload } from "@/lib/utils";
import { tr } from "@/translation";
import DownloadProgressModal from "../dialog/download-progress-modal";
import { useLangue } from "@/context/langue-context";
import { handleConfirmAlert } from "@/lib/alert-confirm-options";
import { clearHistory, DownloadHistoryItem, loadHistory, updateHistory } from "@/lib/download-history";
import { downloadDir } from "@tauri-apps/api/path";

export async function downloadAudioWithProgress(
  initial: string,
  url: string,
  subFolder: AudioFolder,
  fileName: string,
  modelId: number,
  onProgress?: (percent: downloadDrogressType) => void,
  fileOriginalName?: string,
  albumId?:number,
  extension: FileExtension = "mp3"
) {
  //, { redirect: "follow" }
  const filePath = await createPaths(initial,subFolder, fileName, extension);
  const downloads = await downloadDir();
  const fullPath = `${downloads}/${filePath}`;

  let historyItem: DownloadHistoryItem = {
    fileName,
    fileOriginalName: fileOriginalName || "",
    url,
    lng: initial,
    folder: subFolder,
    progress: 0,
    downloadedSize: 0,
    totalSize: 0,
    status: "downloading",
    modelId,
    albumId
  };
  updateHistory(historyItem);

  await startDownload(modelId, url, fullPath, historyItem, onProgress);
}

export const DownloadButton = ({
  audioUrl,
  fileName,
  subFolder,
  setFinishedDownload,
  children,
  fileOriginalName,
  modelId,
  albumId
}: {
  audioUrl: string;
  fileName: string;
  subFolder: AudioFolder;
  setFinishedDownload: (state: boolean) => void;
  children?: React.ReactNode;
  fileOriginalName?: string,
  modelId: number,
  albumId?:number
}) => {
  const { lng } = useLangue();
  const [isDownloading, setIsDownloading] = useState(false);
  const [progress, setProgress] = useState<downloadDrogressType>({
    percent: 0,
    downloadSize: 0,
    totalSize: 0,
  });
  const [openProgress, setOpenProgress] = useState<boolean>(false);

  const onOpenChangeProgress = () => {
    setOpenProgress(!openProgress);
  };

  const stopDownloading = async() => {
    await cancelDownload(modelId)// clear before from the client and next clear locally
    clearHistory(modelId)
    console.log('start clear history',modelId,loadHistory())
    window.dispatchEvent(new Event("downloadHistoryUpdated"));
  };

  useEffect(() => {
    if (progress.percent === 100) {
      setFinishedDownload(true);
    }

    //console.log(progress, 'song progress')
    return () => {};
  }, [progress]);

  const handleDownload = async () => {
    if (!navigator.onLine) {
      handleConfirmAlert(tr("alert.cannot_download"))
      return;
    }
    try {
      onOpenChangeProgress();
      setIsDownloading(true);
      setFinishedDownload(false);
      await downloadAudioWithProgress(
        lng,
        audioUrl,
        subFolder,
        fileName,
        modelId,
        (percent) => {
          setProgress(percent);
        },
        fileOriginalName,
        albumId
      );
    } catch (error) {
      console.error("❌ Download failed:", error);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="">
      <DownloadProgressModal
        open={openProgress}
        onOpenChange={onOpenChangeProgress}
        progress={progress}
        title={tr("download.waiting_for_downloaded_audio")}
        cancel={true}
        stopDownloading={stopDownloading}
      />
      <div onClick={handleDownload} id="downloadBtn">
        {children || (
          <Button disabled={isDownloading}>
            {isDownloading ? (
              <div style={{ marginTop: "10px" }}>
                <progress
                  style={{ backgroundColor: "white" }}
                  value={progress.percent}
                  max={100}
                />
                <div className="flex my-2 justify-between">
                  <div>{progress.percent}%</div>
                  {progress.totalSize > 0 && (
                    <div className="mr-1">
                      {progress.downloadSize + "M"} / {progress.totalSize + "M"}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              tr("button.audio")
            )}
          </Button>
        )}
      </div>
    </div>
  );
};
