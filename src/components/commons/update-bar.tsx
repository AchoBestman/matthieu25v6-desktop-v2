import { useUpdater } from "@/hooks/use-updater";
import { useEffect } from "react";

export function UpdateBar() {
  const { update, progress, status, error, checkForUpdate, installUpdate } = useUpdater();

  useEffect(() => {
    // Automatically check on startup
    checkForUpdate();
  }, [checkForUpdate]);

  return (
    <div className="p-4">

      {status === "checking" && <p>🔎 Checking for updates...</p>}
      {update && status === "idle" && (
        <div>
          <p>✅ Update available: {update.version}</p>
          <button
            className="bg-blue-500 text-white px-3 py-1 rounded"
            onClick={installUpdate}
          >
            Install Update
          </button>
        </div>
      )}
      {status === "downloading" && (
        <p>⬇️ Downloading... {progress}%</p>
      )}
      {status === "finished" && <p>✅ Update installed, restarting...</p>}
      {error && <p className="text-red-500">⚠️ {error}</p>}
    </div>
  );
}
