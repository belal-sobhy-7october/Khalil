import { motion } from 'framer-motion';
import { ChevronRight, Lock, type LucideIcon } from 'lucide-react';
import { useTranslation } from '../../i18n/useTranslation';
import { LANGUAGES, SKILLS, hubOf } from '../../data/learnCatalog';
import { HUB_ICONS } from './icons';

/** The top of a learning hub: its icon, title and a line about it. */
export function HubHero({ icon: Icon, title, subtitle }: { icon: LucideIcon; title: string; subtitle: string }) {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-border-subtle bg-linear-to-br from-clay-soft/12 via-gold-soft/8 to-sage-soft/12 p-5 sm:p-6">
      <span aria-hidden="true" className="pointer-events-none absolute -top-24 -end-20 w-72 h-72 rounded-full bg-gold-soft/20 blur-3xl" />
      <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }} className="relative flex items-start gap-4">
        <span className="w-12 h-12 shrink-0 rounded-2xl bg-clay-soft text-white flex items-center justify-center shadow-sm">
          <Icon size={24} />
        </span>
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-bold text-ink leading-tight">{title}</h1>
          <p className="mt-1 text-sm text-ink-light">{subtitle}</p>
        </div>
      </motion.div>
    </section>
  );
}

/** A heading inside a hub, with how many items it has. */
export function HubHeading({ id, count, children }: { id: string; count: number; children: React.ReactNode }) {
  return (
    <h2 id={id} className="flex items-center gap-2 text-sm font-semibold text-ink-light">
      {children}
      <span className="min-w-5 h-5 px-1.5 rounded-full bg-ink/5 text-[11px] font-semibold flex items-center justify-center tabular-nums">{count}</span>
    </h2>
  );
}

export function SoonBadge() {
  const { t } = useTranslation();
  return (
    <span className="inline-flex items-center gap-1 shrink-0 px-2 py-0.5 rounded-full bg-ink/5 text-ink-light text-[11px] font-semibold">
      <Lock size={11} aria-hidden="true" />
      {t('learn.soon')}
    </span>
  );
}

/** "Learn Languages › English" above a section that lives in a hub: the way back to it. */
export function HubCrumb({ section, onNavigate }: { section: string; onNavigate: (section: string) => void }) {
  const { t } = useTranslation();
  const hub = hubOf(section);
  const language = LANGUAGES.find((l) => l.section === section);
  const skill = SKILLS.find((s) => s.section === section);
  const name = language ? t(`learn.language.${language.id}.name`) : skill ? t(`learn.skill.${skill.id}.name`) : null;
  if (!hub || !name) return null;
  const Icon = HUB_ICONS[hub];
  return (
    // The English hub is wider than Call Center and Sales; the crumb lines up with each.
    <nav aria-label={t('learn.breadcrumb')} className={`mx-auto pt-5 ${hub === 'languages' ? 'max-w-6xl px-6' : 'max-w-5xl px-4 sm:px-6'}`}>
      <ol className="flex items-center gap-1.5 text-sm">
        <li>
          <button
            onClick={() => onNavigate(hub)}
            className="inline-flex items-center gap-1.5 rounded-lg px-1.5 py-0.5 -mx-1.5 text-ink-light hover:text-clay-soft-dark hover:bg-ink/5 transition-colors"
          >
            <Icon size={15} />
            {t(`learn.${hub}.title`)}
          </button>
        </li>
        <li aria-hidden="true" className="text-ink-lighter">
          <ChevronRight size={14} className="rtl:rotate-180" />
        </li>
        <li aria-current="page" className="font-medium text-ink truncate">{name}</li>
      </ol>
    </nav>
  );
}
