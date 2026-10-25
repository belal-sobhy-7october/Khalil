import { useEffect } from 'react';
import {
  CheckSquare,
  Bookmark,
  LogOut,
  Calendar,
  Timer,
  BarChart3,
  Settings,
  MessageCircle,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from '../../i18n/useTranslation';
import { supabase } from '../../lib/supabase';
import { whatsappLink } from '../../lib/contact';
import { useDueSummary } from '../../lib/useDueSummary';
import { hubOf } from '../../data/learnCatalog';
import { HUB_ICONS } from '../Learn/icons';

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  /** A count shown on the item (words due for review). */
  badge?: { count: number; label: string };
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
  const { due } = useDueSummary();
  const LanguagesIcon = HUB_ICONS.languages;
  const SkillsIcon = HUB_ICONS.skills;

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  // The wird and the habits live on the tasks page ("Tasks & Habits"), so they have no item of their own.
  const navItems: NavItem[] = [
    { id: 'todo', label: t('nav.todo'), icon: <CheckSquare size={18} /> },
    { id: 'focus', label: t('nav.focus'), icon: <Timer size={18} /> },
    // English lives in Learn Languages, Call Center and Sales in Learn Skills (data/learnCatalog.ts).
    {
      id: 'languages',
      label: t('nav.languages'),
      icon: <LanguagesIcon size={18} />,
      badge: due ? { count: due, label: t('vocabulary.srs.badge').replace('{count}', String(due)) } : undefined,
    },
    { id: 'skills', label: t('nav.skills'), icon: <SkillsIcon size={18} /> },
    { id: 'calendar', label: t('nav.calendar'), icon: <Calendar size={18} /> },
    { id: 'bookmarks', label: t('nav.bookmarks'), icon: <Bookmark size={18} /> },
    { id: 'analytics', label: t('nav.analytics'), icon: <BarChart3 size={18} /> },
    { id: 'settings', label: t('nav.settings'), icon: <Settings size={18} /> },
  ];

  // Escape closes the menu, like a tap outside it.
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onToggle();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, onToggle]);

  return (
    <>
      <AnimatePresence mode="wait">
        {isOpen && (
          <motion.div
            className="fixed inset-0 bg-ink/20 z-30"
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
              // The menu covers the page on every screen size, so choosing an item closes it.
              onClick={() => {
                onSectionChange(item.id);
                onToggle();
              }}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                (hubOf(activeSection) ?? activeSection) === item.id
                  ? 'bg-ink/8 text-ink border-s-2 border-clay-soft'
                  : 'text-ink-light hover:bg-ink/5 hover:text-ink'
              }`}
            >
              {item.icon}
              <span className="flex-1 text-start">{item.label}</span>
              {item.badge && (
                <span className="min-w-5 h-5 px-1.5 rounded-full bg-clay-soft text-white text-[11px] font-semibold flex items-center justify-center tabular-nums" title={item.badge.label} aria-label={item.badge.label}>
                  {item.badge.count > 99 ? '99+' : item.badge.count}
                </span>
              )}
            </button>
          ))}
        </nav>

        <div className="mt-auto pt-4 border-t border-border-subtle p-4 space-y-1">
          <a
            href={whatsappLink(t('contact.message'))}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center gap-2 px-3 py-2 text-xs text-ink-light hover:text-ink hover:bg-ink/5 rounded-lg transition-all"
          >
            <MessageCircle size={14} />
            <span>{t('contact.menu')}</span>
          </a>
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
