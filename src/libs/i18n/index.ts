import { getLocales } from 'expo-localization';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { en } from './locales/en';
import { fr } from './locales/fr';

// Get the device language (e.g. 'en', 'fr', 'sp')
const deviceLanguage = getLocales()[0]?.languageCode ?? 'en';
i18n.use(initReactI18next).init({
  resources: {
    fr: { translation: fr },
    en: { translation: en },
  },
  lng: deviceLanguage,   // Use device language as default
  fallbackLng: 'en',     // Fallback to English if unsupported
  interpolation: {
    escapeValue: false,  // Required for React / React Native
  },
});
export default i18n;