import {
  Target,
  CheckSquare,
  Archive,
  Bookmark,
  Menu,
  X,
  Languages,
  LayoutDashboard,
  Sun,
  Moon,
  Heart,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from '../../i18n/useTranslation';
import { useAppStore } from '../../store/appStore';

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
}

export default function Sidebar({
  activeSection,
  onSectionChange,
  isOpen,
  onToggle,
}: {
  activeSection: string;
  onSectionChange: (id: string) => void;
  isOpen: boolean;
  onToggle: () => void;
}) {
  const { t, toggleLanguage, language, isRTL } = useTranslation();
  const theme = useAppStore((s) => s.theme);
  const toggleTheme = useAppStore((s) => s.toggleTheme);

  const navItems: NavItem[] = [
    { id: 'dashboard', label: t('nav.dashboard'), icon: <LayoutDashboard size={18} /> },
    { id: 'focus', label: t('nav.daily'), icon: <Target size={18} /> },
    { id: 'todo', label: t('nav.todo'), icon: <CheckSquare size={18} /> },
    { id: 'backlog', label: t('nav.backlog'), icon: <Archive size={18} /> },
    { id: 'life', label: t('nav.life'), icon: <Heart size={18} /> },
    { id: 'bookmarks', label: t('nav.bookmarks'), icon: <Bookmark size={18} /> },
  ];

  return (
    <>
      <button
        onClick={onToggle}
        className="fixed top-4 start-4 z-50 lg:hidden p-2 rounded-lg bg-white dark:bg-slate-800 shadow-md border border-cream-200 dark:border-slate-700 text-slate-700 dark:text-cream-200 hover:bg-terracotta-50 dark:hover:bg-slate-700 transition-colors"
        aria-label="Toggle sidebar"
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      <AnimatePresence mode="wait">
        {isOpen && (
          <motion.div
            className="fixed inset-0 bg-black/30 z-30 lg:hidden"
            onClick={onToggle}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
        )}
      </AnimatePresence>

      <motion.aside
        className={`fixed top-0 start-0 z-40 h-full w-64 bg-white dark:bg-slate-800 border-e border-cream-200 dark:border-slate-700 flex flex-col geometric-overlay transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : (isRTL ? 'translate-x-full' : '-translate-x-full')
        }`}
      >
        <div className="p-6 border-b border-cream-200 dark:border-slate-700">
          <h1 className="text-3xl font-bold font-arabic text-terracotta-600 dark:text-terracotta-400">
            خليل
          </h1>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto scrollbar-thin">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                onSectionChange(item.id);
                if (window.innerWidth < 1024) onToggle();
              }}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                activeSection === item.id
                  ? 'bg-terracotta-50 dark:bg-terracotta-900/30 text-terracotta-700 dark:text-terracotta-300 border-s-2 border-terracotta-500'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-cream-100 dark:hover:bg-slate-700 hover:text-slate-800 dark:hover:text-cream-200'
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-cream-200 dark:border-slate-700 space-y-2">
          <button
            onClick={toggleLanguage}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium bg-cream-100 dark:bg-slate-700 text-slate-700 dark:text-cream-200 hover:bg-cream-200 dark:hover:bg-slate-600 transition-colors"
          >
            <Languages size={16} />
            <span>{language === 'en' ? 'العربية' : 'English'}</span>
          </button>
          <button
            onClick={toggleTheme}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium bg-cream-100 dark:bg-slate-700 text-slate-700 dark:text-cream-200 hover:bg-cream-200 dark:hover:bg-slate-600 transition-colors"
          >
            {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
            <span>{theme === 'light' ? t('theme.dark') : t('theme.light')}</span>
          </button>
        </div>
      </motion.aside>
    </>
  );
}
