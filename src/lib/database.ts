import Database from "@tauri-apps/plugin-sql";
import { exists, mkdir, remove, writeFile } from "@tauri-apps/plugin-fs";
import { AppDatabaseDir, downloadDrogressType } from "./utils";
import { API_URL } from "./env";

/**
 * Delete file for local
 */

export async function deleteDb(initial: string) {
  if (!/^[A-Za-z]{2}-[A-Za-z]{2,4}$/.test(initial)) {
    throw new Error(
      `Invalid format: ${initial} must be in the format 'AA-AA{BC}'`
    );
  }
  const [country, langue] = initial.toLowerCase().split("-");
  const dbPath = `${country}/matth25v6_${langue}.db`;
  await remove(dbPath, {
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
  onProgress?: ({
    percent,
    downloadSize,
    totalSize,
  }: downloadDrogressType) => void,
  signal?: () => boolean
) {
  if (!/^[A-Za-z]{2}-[A-Za-z]{2,4}$/.test(initial)) {
    throw new Error(
      `Invalid format: ${initial} must be in the format 'AA-AA{BC}'`
    );
  }

  const [country, langue] = initial.toLowerCase().split("-");
  const dbPath = `${country}/matth25v6_${langue}.db`;

  await mkdir(country, {
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

  await writeFile(dbPath, blob, {
    baseDir: AppDatabaseDir,
  });
}

//AppConfig is : C:\Users\Lenovo\AppData\Roaming\com.matthieu25v6.org
//it load database from this directory
const database = async (
  initial: string,
  onProgress?: ({
    percent,
    downloadSize,
    totalSize,
  }: downloadDrogressType) => void,
  signal?: () => boolean
) => {
  if (!/^[A-Za-z]{2}-[A-Za-z]{2,4}$/.test(initial)) {
    throw new Error(
      `Invalid format: ${initial} must be in the format 'AA-AA{BC}'`
    );
  }
  const [country, langue] = initial.toLowerCase().split("-");
  const dbPath = `${country}/matth25v6_${langue}.db`;
  // Ensure the folder exists

  await mkdir(country, {
    baseDir: AppDatabaseDir,
    recursive: true,
  });

  const dbExists = await dbExist(initial);

  if (!dbExists) {
    // If the file doesn't exist, download it

    try {
      await downloadWithProgress(
        `${API_URL}/auth/download/${initial}`,
        initial,
        onProgress,
        signal
      );
    } catch (err) {
      console.error("Error downloading database:", err);
    }
  }
  return await Database.load(`sqlite:${dbPath}`).catch((err) => {
    throw err;
  });
};

export const dbExist = async (initial: string) => {
  if (!/^[A-Za-z]{2}-[A-Za-z]{2,4}$/.test(initial)) {
    throw new Error(
      `Invalid format: ${initial} must be in the format 'AA-AA{BC}'`
    );
  }
  const [country, langue] = initial.toLowerCase().split("-");
  const dbPath = `${country}/matth25v6_${langue}.db`;

  const status = await exists(dbPath, {
    baseDir: AppDatabaseDir,
  });

  return status;
};
export default database;
