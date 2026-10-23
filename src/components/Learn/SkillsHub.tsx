import { ArrowRight } from 'lucide-react';
import { useTranslation } from '../../i18n/useTranslation';
import { SKILLS, SKILL_GROUPS } from '../../data/learnCatalog';
import { HUB_ICONS, SKILL_ICONS } from './icons';
import { HubHeading, HubHero, SoonBadge } from './ui';

/** Learn Skills: Call Center Prep and Sales Prep, and the skills still to come. */
export default function SkillsHub({ onNavigate }: { onNavigate: (section: string) => void }) {
  const { t } = useTranslation();
  const open = SKILLS.filter((s) => s.section);
  const soon = SKILLS.filter((s) => !s.section);

  const go = (section: string) => {
    onNavigate(section);
    window.scrollTo?.({ top: 0 });
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      <HubHero icon={HUB_ICONS.skills} title={t('learn.skills.title')} subtitle={t('learn.skills.subtitle')} />

      <section aria-labelledby="learn-skills-open" className="space-y-3">
        <HubHeading id="learn-skills-open" count={open.length}>{t('learn.openNow')}</HubHeading>
        <div className="grid sm:grid-cols-2 gap-3">
          {open.map((s) => {
            const Icon = SKILL_ICONS[s.id];
            return (
              <button
                key={s.id}
                onClick={() => go(s.section!)}
                className="group text-start rounded-2xl border border-border-subtle bg-card p-4 sm:p-5 flex flex-col gap-3 hover:border-clay-soft/40 hover:shadow-md transition-all"
              >
                <span className="flex items-center gap-3">
                  <span className="w-11 h-11 shrink-0 rounded-xl bg-linear-to-br from-clay-soft/20 to-gold-soft/25 text-clay-soft-dark flex items-center justify-center">
                    <Icon size={22} />
                  </span>
                  <span className="text-lg font-bold text-ink leading-tight">{t(`learn.skill.${s.id}.name`)}</span>
                </span>
                <span className="flex-1 text-sm text-ink-light">{t(`learn.skill.${s.id}.blurb`)}</span>
                <span className="self-start inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-clay-soft text-white text-sm font-medium group-hover:bg-clay-soft-dark transition-colors">
                  {t('learn.open')}
                  <ArrowRight size={15} className="rtl:rotate-180" />
                </span>
              </button>
            );
          })}
        </div>
      </section>

      <section aria-labelledby="learn-skills-soon" className="space-y-5">
        <HubHeading id="learn-skills-soon" count={soon.length}>{t('learn.comingSoon')}</HubHeading>
        {SKILL_GROUPS.map((group) => {
          const items = soon.filter((s) => s.group === group);
          if (!items.length) return null;
          return (
            <div key={group} className="space-y-2">
              <h3 className="text-xs font-semibold text-ink-lighter">{t(`learn.group.${group}`)}</h3>
              <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {items.map((s) => {
                  const Icon = SKILL_ICONS[s.id];
                  return (
                    <li key={s.id} title={t('learn.soonHint')} className="rounded-2xl border border-dashed border-ink/15 bg-card/60 p-4 flex items-start gap-3">
                      <span className="w-9 h-9 shrink-0 rounded-xl bg-ink/5 text-ink-light flex items-center justify-center">
                        <Icon size={18} />
                      </span>
                      <span className="flex-1 min-w-0">
                        <span className="flex items-start justify-between gap-2">
                          <span className="text-sm font-semibold text-ink">{t(`learn.skill.${s.id}.name`)}</span>
                          <SoonBadge />
                        </span>
                        <span className="block mt-1 text-xs text-ink-light">{t(`learn.skill.${s.id}.blurb`)}</span>
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </section>
    </div>
  );
}
