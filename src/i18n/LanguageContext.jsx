import { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react";
import en from "./translations/en";
import hi from "./translations/hi";

const LANGUAGE_STORAGE_KEY = "gunlite_language";
const DEFAULT_LANGUAGE = "en";

const SUPPORTED_LANGUAGES = [
  { code: "en", label: "English", shortLabel: "EN" },
  { code: "hi", label: "हिन्दी", shortLabel: "हिन्दी" },
];

const TRANSLATIONS = { en, hi };

function readStoredLanguage() {
  try {
    const saved = localStorage.getItem(LANGUAGE_STORAGE_KEY);
    if (saved === "en" || saved === "hi") {
      return saved;
    }
  } catch {
    /* localStorage unavailable — fallback to English */
  }
  return DEFAULT_LANGUAGE;
}

function getNestedValue(obj, path) {
  if (!obj || typeof path !== "string") return undefined;
  return path.split(".").reduce((acc, part) => (acc && acc[part] !== undefined ? acc[part] : undefined), obj);
}

function interpolate(str, params) {
  if (typeof str !== "string" || !params) return str;
  return str.replace(/\{\{(\w+)\}\}/g, (_, key) =>
    params[key] !== undefined && params[key] !== null ? String(params[key]) : ""
  );
}

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState(readStoredLanguage);

  useEffect(() => {
    try {
      localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
    } catch {
      /* ignore storage errors in restricted environments */
    }
    if (typeof document !== "undefined") {
      document.documentElement.lang = language;
    }
  }, [language]);

  const setLanguage = useCallback((nextLang) => {
    if (nextLang === "en" || nextLang === "hi") {
      setLanguageState(nextLang);
    }
  }, []);

  const t = useCallback(
    (key, params) => {
      const currentDict = TRANSLATIONS[language] || TRANSLATIONS.en;
      let resolved = getNestedValue(currentDict, key);
      if (resolved === undefined) {
        resolved = getNestedValue(TRANSLATIONS.en, key);
      }
      if (resolved === undefined) {
        return key;
      }
      if (typeof resolved === "string") {
        return interpolate(resolved, params);
      }
      return resolved;
    },
    [language]
  );

  const value = useMemo(
    () => ({
      language,
      setLanguage,
      t,
      languages: SUPPORTED_LANGUAGES,
      isHindi: language === "hi",
    }),
    [language, setLanguage, t]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useTranslation() {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error("useTranslation must be used inside <LanguageProvider>");
  }
  return ctx;
}
