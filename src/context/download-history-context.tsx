import React, { createContext, useContext, useEffect, useState } from "react";
import {
  DownloadHistoryItem,
  loadHistory as loadHistoryFromStorage,
  clearHistory as clearHistoryFromStorage,
  clearHistories as clearHistoriesFromStorage,
} from "@/lib/download-history";

type DownloadHistoryContextType = {
  history: DownloadHistoryItem[];
  setHistory: React.Dispatch<React.SetStateAction<DownloadHistoryItem[]>>;
  clearHistory: (modelId: number) => void;
  clearHistories: () => void;
  refreshHistory: () => void;
};

const DownloadHistoryContext = createContext<DownloadHistoryContextType | undefined>(undefined);

export const DownloadHistoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [history, setHistory] = useState<DownloadHistoryItem[]>(loadHistoryFromStorage());

  const refreshHistory = () => {
    setHistory(loadHistoryFromStorage()); 
  };

  const clearHistory = (modelId: number) => {
    clearHistoryFromStorage(modelId);
    refreshHistory();
  };

  const clearHistories = () => {
    clearHistoriesFromStorage();
    refreshHistory();
  };

  // au cas où tu veux auto-sync avec localStorage
  useEffect(() => {
    const interval = setInterval(refreshHistory, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <DownloadHistoryContext.Provider
      value={{ history, setHistory, clearHistory, clearHistories, refreshHistory }}
    >
      {children}
    </DownloadHistoryContext.Provider>
  );
};

export const useDownloadHistory = () => {
  const ctx = useContext(DownloadHistoryContext);
  if (!ctx) throw new Error("useDownloadHistory must be used within DownloadHistoryProvider");
  return ctx;
};
