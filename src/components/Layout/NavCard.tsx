import {
  Target,
  CheckSquare,
  Archive,
  Bookmark,
  LayoutDashboard,
  Sun,
  Moon,
  Languages,
  Heart,
} from 'lucide-react';
import { useTranslation } from '../../i18n/useTranslation';
import { useAppStore } from '../../store/appStore';

const navItems = [
  { id: 'dashboard', labelKey: 'nav.dashboard', icon: <LayoutDashboard size={16} /> },
  { id: 'focus', labelKey: 'nav.daily', icon: <Target size={16} /> },
  { id: 'todo', labelKey: 'nav.todo', icon: <CheckSquare size={16} /> },
  { id: 'backlog', labelKey: 'nav.backlog', icon: <Archive size={16} /> },
  { id: 'life', labelKey: 'nav.life', icon: <Heart size={16} /> },
  { id: 'bookmarks', labelKey: 'nav.bookmarks', icon: <Bookmark size={16} /> },
];

export default function NavCard({
  activeSection,
  onSectionChange,
}: {
  activeSection: string;
  onSectionChange: (id: string) => void;
}) {
  const { t, toggleLanguage, language } = useTranslation();
  const theme = useAppStore((s) => s.theme);
  const toggleTheme = useAppStore((s) => s.toggleTheme);

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-cream-300 dark:border-slate-700 shadow-sm overflow-hidden sticky top-6">
      <div className="p-4 border-b border-cream-200 dark:border-slate-700">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-terracotta-500 flex items-center justify-center text-white text-sm font-bold font-arabic">
            خ
          </div>
          <h1 className="text-lg font-bold font-arabic text-terracotta-600 dark:text-terracotta-400">
            خليل
          </h1>
        </div>
      </div>

      <div className="p-2 space-y-0.5">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onSectionChange(item.id)}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
              activeSection === item.id
                ? 'bg-terracotta-50 dark:bg-terracotta-900/30 text-terracotta-700 dark:text-terracotta-300 border-s-2 border-terracotta-500'
                : 'text-slate-600 dark:text-slate-300 hover:bg-cream-100 dark:hover:bg-slate-700 hover:text-slate-800 dark:hover:text-cream-200'
            }`}
          >
            <span className="shrink-0">{item.icon}</span>
            <span>{t(item.labelKey)}</span>
          </button>
        ))}
      </div>

      <div className="p-3 border-t border-cream-200 dark:border-slate-700 space-y-2">
        <button
          onClick={toggleLanguage}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium bg-cream-100 dark:bg-slate-700 text-slate-700 dark:text-cream-200 hover:bg-cream-200 dark:hover:bg-slate-600 transition-colors"
        >
          <Languages size={15} />
          <span>{language === 'en' ? 'العربية' : 'English'}</span>
        </button>
        <button
          onClick={toggleTheme}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium bg-cream-100 dark:bg-slate-700 text-slate-700 dark:text-cream-200 hover:bg-cream-200 dark:hover:bg-slate-600 transition-colors"
        >
          {theme === 'light' ? <Moon size={15} /> : <Sun size={15} />}
          <span>{theme === 'light' ? t('theme.dark') : t('theme.light')}</span>
        </button>
      </div>
    </div>
  );
}
