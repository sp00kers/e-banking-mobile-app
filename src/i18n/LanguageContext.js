import { createContext, useCallback, useContext } from 'react';
import en from './translations/en.json';
import ms from './translations/ms.json';
import zh from './translations/zh.json';

const translations = { en, zh, ms };

const LanguageContext = createContext();

export function LanguageProvider({ language, setLanguage, children }) {
  const t = useCallback((key) => {
    return translations[language]?.[key] || translations['en'][key] || key;
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useTranslation must be used within a LanguageProvider');
  }
  return context;
}
