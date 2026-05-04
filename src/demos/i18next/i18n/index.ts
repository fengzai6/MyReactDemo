import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import { enUS } from "./locales/en-US";
import { zhCN } from "./locales/zh-CN";

export const LANGUAGES = {
  zhCN: "zh-CN",
  enUS: "en-US",
} as const;
export type Language = (typeof LANGUAGES)[keyof typeof LANGUAGES];

const SUPPORTED_LANGUAGES = Object.values(LANGUAGES);

const DEFAULT_LANGUAGE: Language = LANGUAGES.zhCN;
const I18N_STORAGE_KEY = "MyReactDemo-i18nextLng";

const isLanguageSupported = (lng: string): lng is Language => {
  return SUPPORTED_LANGUAGES.includes(lng as Language);
};

const getInitialLanguage = (): Language => {
  const savedLanguage = localStorage.getItem(I18N_STORAGE_KEY);
  if (savedLanguage && isLanguageSupported(savedLanguage)) {
    return savedLanguage;
  }

  const sysLanguage = navigator.language.toLowerCase();

  // 精确匹配，如 zh-cn 匹配 zh-CN
  const exactMatch = SUPPORTED_LANGUAGES.find(
    (lng) => lng.toLowerCase() === sysLanguage,
  );
  if (exactMatch) return exactMatch;

  // 前缀匹配，如 zh-hans-cn 匹配 zh-CN，en 匹配 en-US
  const prefixMatch = SUPPORTED_LANGUAGES.find(
    (lng) =>
      sysLanguage.startsWith(lng.toLowerCase()) ||
      lng.toLowerCase().startsWith(sysLanguage),
  );
  if (prefixMatch) return prefixMatch;

  return DEFAULT_LANGUAGE;
};

export const resources = {
  [LANGUAGES.zhCN]: {
    translation: zhCN,
  },
  [LANGUAGES.enUS]: {
    translation: enUS,
  },
} as const;

i18n.use(initReactI18next).init({
  resources,
  lng: getInitialLanguage(),
  fallbackLng: LANGUAGES.enUS,
  interpolation: {
    escapeValue: false,
  },
});

i18n.on("languageChanged", (lng) => {
  localStorage.setItem(I18N_STORAGE_KEY, lng);
});

export default i18n;
