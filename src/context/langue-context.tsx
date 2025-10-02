"use client";

import { LangueDataType } from "@/components/commons/langue-dropdown";
import { setTr } from "@/translation";
import {
  createContext,
  useContext,
  useMemo,
  useState,
  ReactNode,
  useEffect,
} from "react";

type LangueContextType = {
  lng: string;
  langName: string;
  setLng: (lng: string) => void;
  setLangName: (langName: string) => void;
  setDefaultLangue: (langue: LangueDataType) => void;
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
  const defauttLangue = localStorage.getItem("defauttLangue");

  useEffect(() => {
    if (defauttLangue) {
      const langue = JSON.parse(defauttLangue);
      setTr(langue.tr);
      setLangName(langue.name);
      setLng(langue.lang);
    }
  }, []);

  const setDefaultLangue = (langue: LangueDataType) => {
    setLng(langue.lang);
    setLangName(langue.name);
    setTr(langue.translation);
    localStorage.setItem(
      "defauttLangue",
      JSON.stringify({
        name: langue.name,
        lang: langue.lang,
        tr: langue.translation,
      })
    );
  };

  const value = useMemo(
    () => ({
      lng,
      langName,
      setLng,
      setLangName,
      setDefaultLangue,
    }),
    [lng, langName]
  );

  return (
    <LangueContext.Provider value={value}>{children}</LangueContext.Provider>
  );
}
