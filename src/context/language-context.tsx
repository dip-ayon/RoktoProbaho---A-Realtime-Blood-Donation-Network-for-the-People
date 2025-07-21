'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';

type Translations = {
  [key: string]: string | Translations;
};

interface LanguageContextType {
  language: 'en' | 'bn';
  toggleLanguage: () => void;
  t: (key: string, replacements?: Record<string, string>) => string;
  isLoaded: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const getNestedValue = (obj: Translations, key: string): string => {
  const keys = key.split('.');
  let result: string | Translations = obj;
  for (const k of keys) {
    if (typeof result === 'object' && result !== null && k in result) {
      result = result[k];
    } else {
      return key; 
    }
  }
  return typeof result === 'string' ? result : key;
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<'en' | 'bn'>('en');
  const [translations, setTranslations] = useState<Translations>({});
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const fetchTranslations = async () => {
      try {
        setIsLoaded(false);
        const response = await fetch(`/locales/${language}.json`);
        if (!response.ok) {
          throw new Error(`Failed to load translations for ${language}`);
        }
        const data = await response.json();
        setTranslations(data);
      } catch (error) {
        console.error(error);
        if (language !== 'en') {
          setLanguage('en');
        } else {
          setTranslations({});
        }
      } finally {
        setIsLoaded(true);
      }
    };

    fetchTranslations();
  }, [language]);

  const toggleLanguage = useCallback(() => {
    setLanguage(prev => (prev === 'en' ? 'bn' : 'en'));
  }, []);

  const t = useCallback((key: string, replacements?: Record<string, string>): string => {
    if (!isLoaded) return '...';
    let str = getNestedValue(translations, key);
    if (replacements) {
        Object.keys(replacements).forEach(rKey => {
            str = str.replace(`{${rKey}}`, replacements[rKey]);
        });
    }
    return str;
  }, [translations, isLoaded]);

  const value = { language, toggleLanguage, t, isLoaded };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
