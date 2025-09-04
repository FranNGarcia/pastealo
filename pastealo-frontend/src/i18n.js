import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Importar archivos de traduccion
import translationEN from './locales/en/translation.json';
import translationES from './locales/es/translation.json';

const resources = {
  en: {
    translation: translationEN
  },
  es: {
    translation: translationES
  }
};

i18n
  // detecta el idioma del navegador
  .use(LanguageDetector)
  // integracion con React
  .use(initReactI18next)
  // inicializar i18next
  .init({
    resources,
    fallbackLng: 'en',
    // configuracion para la deteccion automatica
    detection: {
      order: ['navigator', 'htmlTag'],
      // Solo permitir español e ingles
      checkWhitelist: true
    },
    // Solo estos idiomas estaran disponibles
    supportedLngs: ['en', 'es'],
    interpolation: {
      escapeValue: false // React ya escapa valores
    }
  });

export default i18n;
