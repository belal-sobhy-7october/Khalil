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

  /**
   * Counted text: uses `path_one` / `path_two` when the language defines that
   * form (Arabic has a dual), otherwise `path`, and fills in {count}.
   */
  const tn = useCallback(
    (path: string, count: number): string => {
      const form = count === 1 ? 'one' : count === 2 ? 'two' : null;
      const variant = form ? t(`${path}_${form}`) : null;
      const text = variant && variant !== `${path}_${form}` ? variant : t(path);
      return text.replace('{count}', String(count));
    },
    [t]
  );

  const toggleLanguage = useCallback(() => {
    setLanguage(language === 'en' ? 'ar' : 'en');
  }, [language, setLanguage]);

  const isRTL = language === 'ar';

  return { t, tn, toggleLanguage, language, isRTL };
}
