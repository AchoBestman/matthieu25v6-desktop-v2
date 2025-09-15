import { STORAGE_KEY } from "./env";
import { AudioFolder } from "./utils";

type DownloadStatus = "downloading" | "completed" | "cancelled" | "error";

export interface DownloadHistoryItem {
  fileName: string;
  fileOriginalName: string;
  lng: string;
  url: string;
  folder: AudioFolder;
  progress: number; // %
  downloadedSize: number; // en MB
  totalSize: number; // en MB
  status: DownloadStatus;
  modelId: number;
  albumId?: number;
}

export function loadHistory(): DownloadHistoryItem[] {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}

export function saveHistory(history: DownloadHistoryItem[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
}

export function updateHistory(item: DownloadHistoryItem) {
  const history = loadHistory();
  const idx = history.findIndex(
    (h) => h.fileName === item.fileName && h.folder === item.folder
  );
  if (idx >= 0) history[idx] = item;
  else history.push(item);
  saveHistory(history);
}

export const clearHistory = (modelId: number) => {
  const response = loadHistory().filter((h) => h.modelId !== modelId);
  saveHistory(response);
};

export const clearHistories = () => {
  localStorage.removeItem(STORAGE_KEY);
};

export const getHistory = (id: number, type: '-'|'+') => {
  const history = loadHistory();

  if (history.length === 0) return undefined;

  const index = history.findIndex(h => h.modelId === id);

  if (index >= 0) {
    // trouvé → retourner le suivant ou precedent si dispo
    return history[type === '+' ? Math.min(index + 1, history.length - 1) : Math.max(index - 1, 0)];
  } 

  // pas trouvé → retourner le meme élément
  return history[index];
};
