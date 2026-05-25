import { useCallback } from 'react';
import { useAppStore } from '../store/appStore';
import { translations } from './translations';

export function useTranslation() {
  const language = useAppStore((s) => s.language);
  const setLanguage = useAppStore((s) => s.setLanguage);

  const t = useCallback(
    (path: string): string => {
      const keys = path.split('.');
      let result: unknown = translations[language];
      for (const key of keys) {
        if (result && typeof result === 'object' && key in result) {
          result = (result as Record<string, unknown>)[key];
        } else {
          return path;
        }
      }
      return typeof result === 'string' ? result : path;
    },
    [language]
  );

  const toggleLanguage = useCallback(() => {
    setLanguage(language === 'en' ? 'ar' : 'en');
  }, [language, setLanguage]);

  const isRTL = language === 'ar';

  return { t, toggleLanguage, language, isRTL };
}
