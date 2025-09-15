import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import slug from "slug";
import { BaseDirectory, exists, mkdir, readFile } from "@tauri-apps/plugin-fs";
import { Sermon } from "@/schemas/sermon";
import { downloadDir } from "@tauri-apps/api/path";
import { invoke } from "@tauri-apps/api/core";
import { listen } from "@tauri-apps/api/event";
import { DownloadHistoryItem, updateHistory } from "./download-history";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const styles = {
  activeBtn: {
    hover: "hover:bg-primary hover:text-white hover:opacity-70",
    default: "bg-primary rounded-lg text-white",
  },
};

// all folder type
export type AudioFolder = "Hymns" | "Sermons" | "Files" | "Others";

//all files extensions
export type FileExtension = "pdf" | "mp3" | "mp4" | "doc";

//download status
export type DownloadStatus =
  | "Downloading"
  | "Completed"
  | "Failed"
  | "Cancelled";

// download progress structure
export type DownloadProgress = {
  percent: number;
  downloaded_mb: number;
  total_mb: number;
  status: DownloadStatus;
  id: string;
  file_path: string;
};
//all downloaded files will be put in the download folder
export const DownloadBaseDir = BaseDirectory.Download;

//all db downloaded will be put in this folder
export const AppDatabaseDir = BaseDirectory.AppData;

// files base path
export const BasePath = "Philippekacou";

export const createPaths = async (
  initial: string,
  subFolder: AudioFolder,
  incomeFileName: string,
  extension: FileExtension
) => {
  if (!/^[A-Za-z]{2}-[A-Za-z]{2,4}$/.test(initial)) {
    throw new Error(
      `Invalid format: ${initial} must be in the format 'AA-AA{BC}'`
    );
  }

  const fileName = incomeFileName.replace(
    new RegExp(`\\.(${extension})$`, "i"),
    ""
  );

  const [country, langue] = initial.toLowerCase().split("-");
  const sermonsPath = `${BasePath}/${subFolder}/${country}/${langue}/${fileName}.${extension}`;
  const hymnsPath = `${BasePath}/${subFolder}/${fileName}.${extension}`;
  const sermonsPdfPath = `${BasePath}/${subFolder}/${country}/${langue}/pdf/${fileName}.${extension}`;
  const hymnsPdfPath = `${BasePath}/${subFolder}/pdf/${fileName}.${extension}`;
  let filePath = hymnsPath;

  //create base path
  await mkdir(BasePath, {
    baseDir: DownloadBaseDir,
    recursive: true,
  });

  // create subFolder path
  await mkdir(`${BasePath}/${subFolder}`, {
    baseDir: DownloadBaseDir,
    recursive: true,
  });

  if (extension === "pdf" && subFolder === "Hymns") {
    filePath = hymnsPdfPath;
    //create pdf dir
    await mkdir(`${BasePath}/${subFolder}/pdf`, {
      baseDir: DownloadBaseDir,
      recursive: true,
    });
  }

  if (subFolder === "Sermons" || subFolder === "Others") {
    filePath = sermonsPath;

    //create country dir
    await mkdir(`${BasePath}/${subFolder}/${country}`, {
      baseDir: DownloadBaseDir,
      recursive: true,
    });

    //create langue dir
    await mkdir(`${BasePath}/${subFolder}/${country}/${langue}`, {
      baseDir: DownloadBaseDir,
      recursive: true,
    });

    if (extension === "pdf") {
      filePath = sermonsPdfPath;
      //create pdf dir
      await mkdir(`${BasePath}/${subFolder}/${country}/${langue}/pdf`, {
        baseDir: DownloadBaseDir,
        recursive: true,
      });
    }
  }

  return filePath;
};

// utils/translation-keys.ts
export type DotNestedKeys<T, Prefix extends string = ""> = {
  [K in keyof T]: T[K] extends object
    ? DotNestedKeys<T[K], `${Prefix}${K & string}.`>
    : `${Prefix}${K & string}`;
}[keyof T];

export function toSingleCapitalize(str: string) {
  if (!str) return "";

  // Remove last character
  const trimmed = str.slice(0, -1);

  // Capitalize first letter
  return trimmed.charAt(0).toUpperCase() + trimmed.slice(1).toLowerCase();
}

export function toSingle(str: string) {
  if (!str) return "";

  if (str.endsWith("ies")) {
    return str.slice(0, -3) + "y"; // Replace 'ies' with 'y'
  }
  // Remove last character
  return str.slice(0, -1);
}

export function toCapitalize(str: string) {
  if (!str) return "";

  // Capitalize first letter
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

export function slugifyTitle(title: string) {
  // 2. Replace spaces with _
  title = title.replace(/\s+/g, "_");

  // 3. Replace colons and dashes with underscores
  title = title.replace(/[:\-]/g, "_");

  // 4. Replace multiple underscores with a single underscore
  title = title.replace(/_+/g, "_");

  // 5. Remove accents and special characters except underscores and letters/digits
  // For accents removal:
  title = title.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  // 6. Remove anything not alphanumeric, underscore or exclamation mark (you can add more if needed)
  title = title.replace(/[^A-Z0-9_!]/g, "");

  return title;
}

export const fileUrlFormat = (fileName: string) => {
  return slug(fileName, { replacement: "_", lower: false });
};

export async function getLocalFilePath(
  initial: string,
  subFolder: AudioFolder,
  fileName: string,
  extension: FileExtension = "mp3"
) {
  if (!/^[A-Za-z]{2}-[A-Za-z]{2,4}$/.test(initial)) {
    throw new Error(
      `Invalid format: ${initial} must be in the format 'AA-AA{BC}'`
    );
  }

  const [country, langue] = initial.toLowerCase().split("-");

  const customFileName = fileUrlFormat(fileName);
const sermonsPath = `${BasePath}/${subFolder}/${country}/${langue}/${customFileName}.${extension}`;
  const hymnsPath = `${BasePath}/${subFolder}/${customFileName}.${extension}`;
  let filePath = sermonsPath;
  if(extension ==='pdf' && subFolder === "Others"){
    filePath =  `${BasePath}/${subFolder}/${country}/${langue}/pdf/${customFileName}.${extension}`;
  }

  if (subFolder === "Hymns") {
    filePath = hymnsPath;
  }

  await exists(filePath, {
    baseDir: DownloadBaseDir,
  });

  const bytes = await readFile(filePath, {
    baseDir: DownloadBaseDir,
  });

  const blob = new Blob([new Uint8Array(bytes)], { type: "audio/mpeg" });
  const url = URL.createObjectURL(blob);

  return url;
}

export type downloadDrogressType = {
  percent: number;
  downloadSize: number;
  totalSize: number;
};

export const toObject = (value: unknown) => {
  const isObject = Object.prototype.toString.call(value) === "[object Object]";

  if (!isObject) {
    const isString =
      Object.prototype.toString.call(value) === "[object String]";
    if (isString) {
      return JSON.parse(value as string);
    }
    return value;
  }

  return value;
};

export const firstSermonVerse = (sermon: Sermon): string => {
  if (sermon.verse_number) return `${sermon.verse_number}`;
  if (!sermon.verses || sermon.verses.length === 0) return "";
  const firstVerse = sermon.verses[0];
  return `${firstVerse.number}`;
};

export async function openFile(relativePath: string) {
  const downloads = await downloadDir();
  const fullPath = `${downloads}/${relativePath}`;
  await invoke("open_file", { path: fullPath });
}

export async function startDownload(
  modelId: number,
  url: string,
  filePath: string,
  historyItem: DownloadHistoryItem,
  onProgress?: (progress: downloadDrogressType) => void
) {
  // Écoute des events avant d'invoquer Rust
  const unlisten = await listen("download_progress", (event) => {
    const { id, percent, downloaded_mb, total_mb, status } =
      event.payload as DownloadProgress;

    if (onProgress && id === modelId.toString()) {
      historyItem = {
        ...historyItem,
        progress: Math.round(percent),
        downloadedSize: Number(downloaded_mb.toFixed(1)),
        totalSize: Number.parseFloat(total_mb.toFixed(1)),
      };

      onProgress({
        percent: Math.round(percent),
        downloadSize: Number.parseFloat(downloaded_mb.toFixed(1)),
        totalSize: Number.parseFloat(total_mb.toFixed(1)),
      });

      if (status === "Failed") {
        console.error(`Téléchargement ${id} échoué`);
        historyItem = {
          ...historyItem,
          status: "error",
        };
      } else if (status === "Cancelled") {
        console.warn(`Téléchargement ${id} annulé`);
        historyItem = {
          ...historyItem,
          status: "cancelled",
        };
      } else if (status === "Completed") {
        historyItem = {
          ...historyItem,
          status: "completed",
        };
        console.log(`Téléchargement ${id} terminé`);
      }

      updateHistory(historyItem);
    }
  });

  try {
    // ⚠️ appel invoke après avoir mis en place l'écoute
    const response = await invoke("download_audio", {
      id: modelId.toString(),
      url,
      fileFullPath: filePath, // fileFullPath correspond au file_full_path Rust. si on file_full_path xa echoue
    });
    return response;
  } finally {
    // Arrêter l'écoute des events pour éviter les fuites mémoire
    unlisten();
  }
}

export const cancelDownload = async (modelId: number): Promise<boolean> => {
  const response = await invoke("cancel_download", { id: modelId.toString() });
  console.log(response,'clear data')
  return response as boolean
};
