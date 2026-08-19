import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';

import ar from './locales/ar.json';

export const defaultNS = 'translation';

export const resources = {
  ar: {
    translation: ar,
  },
} as const;

void i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,

    lng: 'ar',
    fallbackLng: 'ar',
    supportedLngs: ['ar'],

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
