import Database from "@tauri-apps/plugin-sql";
import { exists, mkdir, remove, writeFile } from "@tauri-apps/plugin-fs";
import { AppDatabaseDir, downloadDrogressType, getDbInfo } from "./utils";
import { API_URL } from "./env";
import { appDataDir, join } from "@tauri-apps/api/path";

/**
 * Delete file for local
 */

export async function deleteDb(initial: string, isCommon: boolean) {
  const dbInfo = await getDbInfo(initial, isCommon);
  await remove(dbInfo.dbpath, {
    baseDir: AppDatabaseDir,
    recursive: true,
  });
}

/**
 * Download a file with progress support and save to disk
 */
export async function downloadWithProgress(
  url: string,
  initial: string,
  isCommon: boolean,
  onProgress?: ({
    percent,
    downloadSize,
    totalSize,
  }: downloadDrogressType) => void,
  signal?: () => boolean
) {
  const dbInfo = await getDbInfo(initial, isCommon);

  await mkdir(dbInfo.subdir, {
    baseDir: AppDatabaseDir,
    recursive: true,
  });

  const bustCacheUrl = `${url}?t=${Date.now()}`;

  const res = await fetch(bustCacheUrl, { cache: "no-store" });

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
    if (signal?.()) {
      await reader.cancel(); // Properly cancel the reader
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

  await writeFile(dbInfo.dbpath, blob, {
    baseDir: AppDatabaseDir,
  });
}

//AppConfig is : C:\Users\Lenovo\AppData\Roaming\com.matthieu25v6.org
//it load database from this directory
const database = async (
  initial: string,
  isCommon: boolean,
  onProgress?: ({
    percent,
    downloadSize,
    totalSize,
  }: downloadDrogressType) => void,
  signal?: () => boolean
) => {

  const dbInfo = await getDbInfo(initial, isCommon);

  const baseDir = await appDataDir();// ~/.local/share/<appname>/
  const fullDbPath = await join(baseDir, dbInfo.subdir, dbInfo.dbname);
  // Ensure the folder exists

  await mkdir(dbInfo.subdir, {
    baseDir: AppDatabaseDir,
    recursive: true,
  });

  const dbExists = await dbExist(initial, isCommon);

  if (!dbExists) {
    // If the file doesn't exist, download it

    const url = isCommon ? `${API_URL}/auth/download-common-db` : `${API_URL}/auth/download/${initial}`;

    try {
      await downloadWithProgress(
        url,
        initial,
        isCommon,
        onProgress,
        signal
      );
    } catch (err) {
      console.error("Error downloading database:", err);
    }
  }
  return await Database.load(`sqlite:${fullDbPath}`).catch((err) => {
    throw err;
  });
};

export const dbExist = async (initial: string, isCommon: boolean) => {
  const dbInfo = await getDbInfo(initial, isCommon);

  const status = await exists(dbInfo.dbpath, {
    baseDir: AppDatabaseDir,
  });

  return status;
};
export default database;
