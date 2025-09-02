
import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';

type Language = 'id' | 'en' | 'ar';

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  translations: any;
  t: (key: string, replacements?: { [key: string]: string }) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const getNestedTranslation = (translations: any, key: string): string | undefined => {
  return key.split('.').reduce((obj, k) => (obj ? obj[k] : undefined), translations);
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    return (localStorage.getItem('app-language') as Language) || 'id';
  });
  const [translations, setTranslations] = useState<any>({});
  const [allTranslations, setAllTranslations] = useState<Record<Language, any> | null>(null);

  useEffect(() => {
    const loadAllTranslations = async () => {
      try {
        const [id, en, ar] = await Promise.all([
          fetch('/locales/id.json').then(res => res.json()),
          fetch('/locales/en.json').then(res => res.json()),
          fetch('/locales/ar.json').then(res => res.json()),
        ]);
        setAllTranslations({ id, en, ar });
      } catch (error) {
        console.error('Failed to load translation files:', error);
      }
    };
    loadAllTranslations();
  }, []);

  useEffect(() => {
    if (allTranslations) {
      const selectedTranslations = allTranslations[language];
      if (selectedTranslations) {
        setTranslations(selectedTranslations);
      } else {
        console.error(`Could not load translations for ${language}, falling back to 'id'.`);
        setTranslations(allTranslations.id);
      }
    }
    
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language, allTranslations]);

  const setLanguage = (lang: Language) => {
    localStorage.setItem('app-language', lang);
    setLanguageState(lang);
  };

  const t = useCallback((key: string, replacements?: { [key: string]: string }): string => {
    let translation = getNestedTranslation(translations, key);

    if (translation === undefined) {
      // Don't warn if translations haven't loaded yet
      if (Object.keys(translations).length > 0) {
        console.warn(`Translation key not found: ${key}`);
      }
      return key;
    }

    if (replacements) {
      Object.keys(replacements).forEach(placeholder => {
        translation = translation.replace(`{{${placeholder}}}`, replacements[placeholder]);
      });
    }

    return translation;
  }, [translations]);

  // Render a loading state while translations are being fetched
  if (!allTranslations) {
    return <div className="h-screen w-screen bg-gray-900 flex items-center justify-center text-white">Loading...</div>;
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, translations, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
