import { useState, useCallback } from "react";
import { check, Update } from "@tauri-apps/plugin-updater";
import { relaunch } from "@tauri-apps/plugin-process";

export function useUpdater() {
  const [update, setUpdate] = useState<Update | null>(null);
  const [progress, setProgress] = useState<number>(0);
  const [status, setStatus] = useState<
    "idle" | "checking" | "downloading" | "finished" | "error"
  >("idle");
  const [error, setError] = useState<string | null>(null);

  // Check if update available
  const checkForUpdate = useCallback(async () => {
    setStatus("checking");
    try {
      const result = await check();
      if (result) {
        console.log(
          `found update ${result.version} from ${result.date} with notes ${result.body} to update at ${result.currentVersion} version`
        );
        setUpdate(result);
      } else {
        setUpdate(null);
      }
      setStatus("idle");
    } catch (err: any) {
      console.log("checking for updates error from server...", err);
      setError(err.message ?? "Failed to check updates");
      setStatus("error");
    }
  }, []);

  // Download & install
  const installUpdate = useCallback(async () => {
    if (!update) return;
    setStatus("downloading");
    let total = 0;
    let downloaded = 0;

    try {
      await update.downloadAndInstall((event) => {
        switch (event.event) {
          case "Started":
            total = event.data.contentLength ?? 0;
            break;
          case "Progress":
            downloaded += event.data.chunkLength;
            setProgress(Math.round((downloaded / total) * 100));
            break;
          case "Finished":
            setProgress(100);
            setStatus("finished");
            break;
        }
      });
      await relaunch();
    } catch (err: any) {
      setError(err.message ?? "Update failed");
      setStatus("error");
    }
  }, [update]);

  return {
    update,
    progress,
    status,
    error,
    checkForUpdate,
    installUpdate,
  };
}
