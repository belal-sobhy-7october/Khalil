import {
  Target,
  CheckSquare,
  Archive,
  Bookmark,
  LayoutDashboard,
  Heart,
} from 'lucide-react';
import { useTranslation } from '../../i18n/useTranslation';
import CalligraphyWatermark from '../Common/CalligraphyWatermark';

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
  const { t } = useTranslation();

  return (
    <div className="bg-card border border-border-subtle rounded-xl overflow-hidden sticky top-8">
      <div className="p-5 border-b border-border-subtle relative">
        <CalligraphyWatermark character="خ" opacity={0.05} />
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-clay-soft flex items-center justify-center text-white text-base font-bold font-amiri">
            خ
          </div>
          <div>
            <h1 className="text-lg font-bold font-amiri text-ink leading-none">
              {t('app.title')}
            </h1>
            <p className="text-xs text-ink-light mt-0.5 font-ui">{t('app.subtitle')}</p>
          </div>
        </div>
      </div>

      <div className="p-2 space-y-0.5">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onSectionChange(item.id)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
              activeSection === item.id
                ? 'bg-ink/8 text-ink border-s-2 border-clay-soft'
                : 'text-ink-light hover:bg-ink/5 hover:text-ink'
            }`}
          >
            <span className="shrink-0">{item.icon}</span>
            <span>{t(item.labelKey)}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
