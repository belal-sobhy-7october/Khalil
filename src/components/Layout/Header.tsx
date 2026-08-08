import { Languages, Sun, Moon, Menu, X } from 'lucide-react';
import { useTranslation } from '../../i18n/useTranslation';
import { useAppStore } from '../../store/appStore';
import AccountMenu from './AccountMenu';

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

  return (
    <header className="fixed top-0 inset-x-0 z-20 h-14 bg-card border-b border-border-subtle">
      <div className="h-full max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between">
        <button
          onClick={onToggle}
          className="lg:hidden p-2 rounded-lg text-ink-light hover:text-ink hover:bg-ink/5 transition-colors"
          aria-label="Toggle sidebar"
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
            <span>{theme === 'light' ? t('theme.dark') : t('theme.light')}</span>
          </button>
          <div className="w-px h-5 bg-border-subtle mx-1" />
          <AccountMenu />
        </div>
      </div>
    </header>
  );
}
