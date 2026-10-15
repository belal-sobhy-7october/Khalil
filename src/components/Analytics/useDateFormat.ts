import { useTranslation } from '../../i18n/useTranslation';

export function useDateFormat() {
  const { language } = useTranslation();
  const locale = language === 'ar' ? 'ar-EG' : 'en-US';
  return (date: string, opts: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short' }) =>
    new Date(`${date}T00:00:00`).toLocaleDateString(locale, opts);
}
