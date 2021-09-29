import i18n from "i18next";
import Backend from "i18next-xhr-backend";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";

i18n
  .use(Backend)
  // detect user language
  // learn more: https://github.com/i18next/i18next-browser-languageDetector
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    ns: ["common", "dashboard", "enum", "interviewAssessment", "jobApplication", "jobPost", "manageEmployer", "manageFirm", "managePremiumAgency", "matrix", "reports", "sidebar", "topbar", "trackJob"], ///modules to be preloaded
    defaultNS: "common", ///default module to be preloaded
    // supportedLngs: ["en", "fr"], ///list of supported languages
    load: 'languageOnly', ///check for language and not culture
    lng: process.env.REACT_APP_LANG, ///set for testing purpose
    fallbackLng: process.env.REACT_APP_LANG, ///default language to be used
    debug: true,

    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
