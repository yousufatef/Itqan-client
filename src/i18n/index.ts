import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';

import en from './locales/en.json';
import it from './locales/it.json';

export const defaultNS = 'translation';

export const resources = {
  en: {
    translation: en,
  },
  it: {
    translation: it,
  },
} as const;

void i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,

    fallbackLng: 'en',
    supportedLngs: ['en', 'it'],

    defaultNS,
    ns: [defaultNS],

    interpolation: {
      escapeValue: false,
    },

    detection: {
      order: ['localStorage', 'cookie', 'navigator', 'htmlTag'],
      caches: ['localStorage', 'cookie'],
    },

    react: {
      useSuspense: false,
    },
  });

export default i18n;
