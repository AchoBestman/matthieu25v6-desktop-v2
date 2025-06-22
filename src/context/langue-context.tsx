"use client";

import {
  createContext,
  useContext,
  useMemo,
  useState,
  ReactNode,
} from "react";

type LangueContextType = {
  lng: string;
  langName: string;
  setLng: (lng: string) => void;
  setLangName: (langName: string) => void;
};

const LangueContext = createContext<LangueContextType | null>(null);

export function useLangue() {
  const context = useContext(LangueContext);
  if (!context) {
    throw new Error("useI18next must be used within an I18nextProvider");
  }
  return context;
}

export function LangueProvider({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const [lng, setLng] = useState("en-en");
  const [langName, setLangName] = useState("English");

  const value = useMemo(
    () => ({
      lng,
      langName,
      setLng,
      setLangName,
    }),
    [lng, langName]
  );

  return (
    <LangueContext.Provider value={value}>{children}</LangueContext.Provider>
  );
}
