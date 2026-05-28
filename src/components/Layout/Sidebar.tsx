import {
  Target,
  CheckSquare,
  Archive,
  Bookmark,
  LayoutDashboard,
  Heart,
  LogOut,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from '../../i18n/useTranslation';
import { supabase } from '../../lib/supabase';

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
  const { t, isRTL } = useTranslation();

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

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
      <AnimatePresence mode="wait">
        {isOpen && (
          <motion.div
            className="fixed inset-0 bg-ink/20 z-30 lg:hidden"
            onClick={onToggle}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
        )}
      </AnimatePresence>

      <motion.aside
        className={`fixed top-0 start-0 z-40 h-full w-64 bg-card border-e border-border-subtle flex flex-col transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : (isRTL ? 'translate-x-full' : '-translate-x-full')
        }`}
      >
        <div className="p-6 border-b border-border-subtle">
          <h1 className="text-3xl font-bold font-amiri text-ink">
            {t('app.title')}
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
                  ? 'bg-ink/8 text-ink border-s-2 border-clay-soft'
                  : 'text-ink-light hover:bg-ink/5 hover:text-ink'
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="mt-auto pt-4 border-t border-border-subtle p-4">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 text-xs text-ink-lighter hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg transition-all"
          >
            <LogOut size={14} />
            <span>{t('auth.logout')}</span>
          </button>
        </div>
      </motion.aside>
    </>
  );
}
