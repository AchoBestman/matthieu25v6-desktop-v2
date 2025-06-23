"use client";
import { Button } from "@/components/ui/button";
import React, { useEffect, useState } from "react";
import { BaseDirectory, writeFile, mkdir } from "@tauri-apps/plugin-fs";
import { downloadDrogressType } from "@/lib/utils";
import { resources } from "@/lib/resources";
import { API_URL } from "@/lib/env";
import { tr } from "@/translation";
import DownloadProgressModal from "../dialog/download-progress-modal";
import { useLangue } from "@/context/langue-context";

export async function downloadAudioWithProgress(
  initial: string,
  url: string,
  subFolder: "Hymns" | "Sermons" | "Others",
  fileName: string,
  onProgress?: (percent: downloadDrogressType) => void,
  signal?: boolean
) {
  if (!/^[A-Za-z]{2}-[A-Za-z]{2,4}$/.test(initial)) {
    throw new Error(
      `Invalid format: ${initial} must be in the format 'AA-AA{BC}'`
    );
  }
  const basePath = "Philippekacou";
  const [country, langue] = initial.toLowerCase().split("-");
  const sermonsPath = `${basePath}/${subFolder}/${country}/${langue}/${fileName}.mp3`;
  const hymnsPath = `${basePath}/${subFolder}/${fileName}.mp3`;
  let filePath = hymnsPath;

  const baseDir = BaseDirectory.Audio;
  //create base path
  await mkdir(basePath, {
    baseDir: baseDir,
    recursive: true,
  });

  // create subFolder path
  await mkdir(`${basePath}/${subFolder}`, {
    baseDir: baseDir,
    recursive: true,
  });

  if (subFolder === "Sermons" || subFolder === "Others") {
    filePath = sermonsPath;

    //create country dir
    await mkdir(`${basePath}/${subFolder}/${country}`, {
      baseDir: baseDir,
      recursive: true,
    });

    //create langue dir
    await mkdir(`${basePath}/${subFolder}/${country}/${langue}`, {
      baseDir: baseDir,
      recursive: true,
    });
  }

  //, { redirect: "follow" }
  const res = await fetch(
    `${API_URL}/${initial}/${resources.downloadAudio}?url=${url}&name=${fileName}.mp3`
  );
  if (!res.ok || !res.body) {
    throw new Error("Failed to fetch file.");
  }

  const contentLength = res.headers.get("Content-Length");
  if (!contentLength) {
    throw new Error("No content-length header in response.");
  }

  const total = parseInt(contentLength, 10);
  const reader = res.body.getReader();
  const totalSize = total / (1024 * 1024);
  let downloadSize = 0;

  let received = 0;
  const chunks: Uint8Array[] = [];

  while (true) {
    // Handle cancellation mid-stream
    if (signal) {
      reader.cancel(); // cancel the reader
      throw new Error("Download cancelled by user.");
    }

    const { done, value } = await reader.read();
    if (done) break;

    if (value) {
      chunks.push(value);
      received += value.length;
      const percent = Math.round((received / total) * 100);
      downloadSize = received / (1024 * 1024);
      onProgress?.({
        percent,
        downloadSize: Number.parseFloat(downloadSize.toFixed(1)),
        totalSize: Number.parseFloat(totalSize.toFixed(1)),
      });
    }
  }

  // Combine chunks into one Uint8Array
  const blob = new Uint8Array(received);
  let position = 0;
  for (const chunk of chunks) {
    blob.set(chunk, position);
    position += chunk.length;
  }

  await writeFile(filePath, blob, {
    baseDir: baseDir,
  });
}

export const DownloadButton = ({
  audioUrl,
  fileName,
  subFolder,
  setFinishedDownload,
  children,
}: {
  audioUrl: string;
  fileName: string;
  subFolder: "Hymns" | "Sermons";
  setFinishedDownload: (state: boolean) => void;
  children?: React.ReactNode;
}) => {
  const {lng} = useLangue()
  const [isDownloading, setIsDownloading] = useState(false);
  const [progress, setProgress] = useState<downloadDrogressType>({
    percent: 0,
    downloadSize: 0,
    totalSize: 0,
  });
  const [openProgress, setOpenProgress] = useState<boolean>(false);
  const [abortDownloading, setAbortDownloading] = useState<boolean>(false);

  const onOpenChangeProgress = () => {
    setOpenProgress(!openProgress);
  };

  const stopDownloading = () => {
    setAbortDownloading((abortDownloading) => !abortDownloading);
  };

  useEffect(() => {
    if (progress.percent === 100) {
      setFinishedDownload(true);
    }

    return () => {};
  }, [progress]);

  const handleDownload = async () => {
    if (!navigator.onLine) {
      alert(tr("alert.cannot_download"));
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
        (percent) => {
          setProgress(percent);
        },
        abortDownloading
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
