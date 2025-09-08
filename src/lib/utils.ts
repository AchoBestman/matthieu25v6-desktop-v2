import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import slug from "slug";
import { BaseDirectory, exists, readFile } from "@tauri-apps/plugin-fs";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const styles = {
  activeBtn: {
    hover: "hover:bg-primary hover:text-white hover:opacity-70",
    default: "bg-primary rounded-lg text-white",
  },
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
  subFolder: "Hymns" | "Sermons" | "Others",
  fileName: string
) {
  if (!/^[A-Za-z]{2}-[A-Za-z]{2,4}$/.test(initial)) {
    throw new Error(
      `Invalid format: ${initial} must be in the format 'AA-AA{BC}'`
    );
  }
  const basePath = "Philippekacou";
  const [country, langue] = initial.toLowerCase().split("-");

  const customFileName = fileUrlFormat(fileName);
  const sermonsPath = `${basePath}/${subFolder}/${country}/${langue}/${customFileName}.mp3`;
  const hymnsPath = `${basePath}/${subFolder}/${customFileName}.mp3`;
  let filePath = sermonsPath;

  if (subFolder === "Hymns") {
    filePath = hymnsPath;
  }

  const baseDir = BaseDirectory.Audio;

  await exists(filePath, {
    baseDir: baseDir,
  });

  const bytes = await readFile(filePath, {
    baseDir: baseDir,
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

export type AudioFolder = "Hymns" | "Sermons" | "Others";

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
