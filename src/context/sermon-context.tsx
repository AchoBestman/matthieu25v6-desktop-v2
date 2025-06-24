"use client";

import { createContext, useContext, useMemo, useState, ReactNode } from "react";

type SermonContextType = {
  number: string;
  fontSize: number;
  verseNumber: string;
  search?: string;
  setNumber: (number: string) => void;
  setFontSize: (fontSize: number) => void;
  setVerseNumber: (verseNumber: string) => void;
  setSearch: (search: string) => void;
};

const SermonContext = createContext<SermonContextType | null>(null);

export function useSermon() {
  const context = useContext(SermonContext);
  if (!context) {
    throw new Error("useSermon must be used within an SermonProvider");
  }
  return context;
}

export function SermonProvider({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const [number, setNumber] = useState("1");
  const [fontSize, setFontSize] = useState(16);
  const [verseNumber, setVerseNumber] = useState("");
  const [search, setSearch] = useState("");

  const value = useMemo(
    () => ({
      number,
      fontSize,
      verseNumber,
      search,
      setNumber,
      setFontSize,
      setVerseNumber,
      setSearch,
    }),
    [number, fontSize, verseNumber, search]
  );

  return (
    <SermonContext.Provider value={value}>{children}</SermonContext.Provider>
  );
}
