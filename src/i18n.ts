import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Load translation files
import en from './locales/en/translation.json';
import nl from './locales/nl/translation.json';

const resources = {
  en: { translation: en },
  nl: { translation: nl },
} as const;

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'nl',
    supportedLngs: ['en', 'nl'],
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'querystring', 'htmlTag', 'navigator'],
      caches: ['localStorage'],
    },
  });

i18n.on('languageChanged', (lng) => {
  if (typeof document !== 'undefined') {
    document.documentElement.lang = lng;
    try {
      document.title = i18n.t('common.appName');
    } catch {}
  }
});

export default i18n;
