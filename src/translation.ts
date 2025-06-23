// i18n.ts (create this file separately)
import i18next from "i18next";
import en from "@/locales/en.json";
import fr from "@/locales/fr.json";
import es from "@/locales/es.json";
import pt from "@/locales/pt.json";
import ar from "@/locales/ar.json";
import de from "@/locales/de.json";
import fa from "@/locales/fa.json";
import hi from "@/locales/hi.json";
import it from "@/locales/it.json";
import ja from "@/locales/ja.json";
import ro from "@/locales/ro.json";
import ru from "@/locales/ru.json";
import ta from "@/locales/ta.json";
import zh from "@/locales/zh.json";
import { DotNestedKeys } from "./lib/utils";

export type TranslationSchema = typeof en;
export type TranslationKeySchema = DotNestedKeys<TranslationSchema>;
type ResourcesSchema = Record<string, { translation: TranslationSchema }>;

const resources: ResourcesSchema = {
  en: {
    translation: en,
  },
  fr: {
    translation: fr,
  },
  es: {
    translation: es,
  },
  pt: {
    translation: pt,
  },
  ar: {
    translation: ar,
  },
  de: {
    translation: de,
  },
  fa: {
    translation: fa,
  },
  hi: {
    translation: hi,
  },
  it: {
    translation: it,
  },
  ja: {
    translation: ja,
  },
  ro: {
    translation: ro,
  },
  ru: {
    translation: ru,
  },
  ta: {
    translation: ta,
  },
  zh: {
    translation: zh,
  },
};

i18next.init({
  resources,
  lng: "en", // default localesuage
  fallbackLng: "en",
  interpolation: { escapeValue: false },
});

// Type-safe translation function
function tr<K extends TranslationKeySchema>(
  key: K,
  options?: Record<string, any>
) {
  return i18next.t(key, options);
}
const setTr = i18next.changeLanguage;

export { tr, setTr };
