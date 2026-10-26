import { Languages, Sun, Moon, Menu, X } from 'lucide-react';
import { useTranslation } from '../../i18n/useTranslation';
import { useAppStore } from '../../store/appStore';
import AccountMenu from './AccountMenu';
import GuestButtons from '../Auth/GuestButtons';
import { isGuestSession } from '../../lib/guest';

export default function Header({
  isOpen,
  onToggle,
}: {
  isOpen: boolean;
  onToggle: () => void;
}) {
  const { t, toggleLanguage, language } = useTranslation();
  const theme = useAppStore((s) => s.theme);
  const toggleTheme = useAppStore((s) => s.toggleTheme);
  // A guest (or someone browsing with no account) gets "Create account" and "Sign in" instead of the account menu.
  const guest = useAppStore((s) => !s.session || isGuestSession(s.session));

  return (
    <header className="fixed top-0 inset-x-0 z-20 h-14 bg-card border-b border-border-subtle">
      <div className="h-full max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between">
        <button
          onClick={onToggle}
          className="p-2 rounded-lg text-ink-light hover:text-ink hover:bg-ink/5 transition-colors"
          aria-label={t('nav.toggleSidebar')}
          data-guide="menu"
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        <div className="flex items-center gap-1">
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm text-ink-light hover:text-ink border border-transparent hover:border-border-subtle transition-all"
          >
            <Languages size={16} />
            <span>{language === 'en' ? 'العربية' : 'English'}</span>
          </button>
          <button
            onClick={toggleTheme}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm text-ink-light hover:text-ink border border-transparent hover:border-border-subtle transition-all"
          >
            {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
            {/* Text only from 360px: the header doesn't fit a 320px phone with it. */}
            <span className="sr-only min-[360px]:not-sr-only">{theme === 'light' ? t('theme.dark') : t('theme.light')}</span>
          </button>
          <div className="w-px h-5 bg-border-subtle mx-1" />
          {guest ? <GuestButtons /> : <AccountMenu />}
        </div>
      </div>
    </header>
  );
}
