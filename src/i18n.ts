import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import ru from "./locales/ru/translation.json";
import uz from "./locales/uz/translation.json";
import LanguageDetector from "i18next-browser-languagedetector";

/**
 * Конфигурация i18n с автоматическим определением языка браузера
 * 
 * Порядок определения языка:
 * 1. localStorage - сохраненный пользователем выбор
 * 2. navigator - язык браузера
 * 3. htmlTag - атрибут lang в HTML
 * 
 * Поддерживаемые языки:
 * - ru (русский) - для ru, be, uk и других славянских языков
 * - uz (узбекский) - для uz и uz-* локалей
 * - fallback на ru для всех остальных языков
 */
i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      ru: { translation: ru },
      uz: { translation: uz },
    },
    fallbackLng: "ru",
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ["localStorage", "navigator", "htmlTag"],
      caches: ["localStorage"],
      lookupLocalStorage: "i18nextLng",
      lookupSessionStorage: "i18nextLng",
      lookupCookie: "i18nextLng",
      lookupQuerystring: "lng",
      lookupFromPathIndex: 0,
      lookupFromSubdomainIndex: 0,
      
      // Поддержка узбекского языка
      convertDetectedLanguage: (lng: string) => {
        // Если браузер определяет узбекский язык, используем 'uz'
        if (lng.startsWith('uz') || lng.startsWith('uz-')) {
          return 'uz';
        }
        // Если русский или другие славянские языки
        if (lng.startsWith('ru') || lng.startsWith('be') || lng.startsWith('uk')) {
          return 'ru';
        }
        // По умолчанию возвращаем как есть
        return lng;
      }
    },
  });

export default i18n;
