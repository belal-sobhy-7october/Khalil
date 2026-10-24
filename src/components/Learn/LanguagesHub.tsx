import { ArrowRight } from 'lucide-react';
import { useTranslation } from '../../i18n/useTranslation';
import { useDueSummary } from '../../lib/useDueSummary';
import { LANGUAGES } from '../../data/learnCatalog';
import { HUB_ICONS } from './icons';
import { HubHeading, HubHero, SoonBadge } from './ui';

/** Learn Languages: English (the English hub) and the languages still to come. */
export default function LanguagesHub({ onNavigate }: { onNavigate: (section: string) => void }) {
  const { t, tn } = useTranslation();
  const { due } = useDueSummary();
  const open = LANGUAGES.filter((l) => l.section);
  const soon = LANGUAGES.filter((l) => !l.section);

  const go = (section: string) => {
    onNavigate(section);
    window.scrollTo?.({ top: 0 });
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      <HubHero icon={HUB_ICONS.languages} title={t('learn.languages.title')} subtitle={t('learn.languages.subtitle')} />

      <section aria-labelledby="learn-languages-open" className="space-y-3">
        <HubHeading id="learn-languages-open" count={open.length}>{t('learn.openNow')}</HubHeading>
        {open.map((l) => {
          const name = t(`learn.language.${l.id}.name`);
          return (
            <button
              key={l.id}
              onClick={() => go(l.section!)}
              className="group w-full text-start rounded-2xl border border-border-subtle bg-card p-4 sm:p-5 flex items-center gap-4 sm:gap-5 hover:border-clay-soft/40 hover:shadow-md transition-all"
            >
              <span lang={l.code} dir="ltr" className="shrink-0 w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-linear-to-br from-clay-soft/20 to-gold-soft/25 text-clay-soft-dark flex items-center justify-center text-lg sm:text-xl font-bold">
                {l.hello}
              </span>
              <span className="flex-1 min-w-0">
                <span className="flex items-baseline gap-2 flex-wrap">
                  <span className="text-xl font-bold text-ink">{name}</span>
                  {l.native !== name && <span lang={l.code} className="text-sm text-ink-light">{l.native}</span>}
                </span>
                <span dir="ltr" className="block mt-1 text-xs text-ink-light rtl:text-right">{t(`learn.language.${l.id}.parts`)}</span>
                {l.section === 'vocabulary' && due > 0 && (
                  <span className="inline-flex mt-2 px-2 py-0.5 rounded-full bg-clay-soft/12 text-clay-soft-dark text-xs font-semibold">
                    {tn('learn.wordsDue', due)}
                  </span>
                )}
              </span>
              <span className="shrink-0 hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-clay-soft text-white text-sm font-medium group-hover:bg-clay-soft-dark transition-colors">
                {t('learn.open')}
                <ArrowRight size={15} className="rtl:rotate-180" />
              </span>
            </button>
          );
        })}
      </section>

      <section aria-labelledby="learn-languages-soon" className="space-y-3">
        <HubHeading id="learn-languages-soon" count={soon.length}>{t('learn.comingSoon')}</HubHeading>
        <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {soon.map((l) => (
            <li key={l.id} title={t('learn.soonHint')} className="rounded-2xl border border-dashed border-ink/15 bg-card/60 p-4 flex flex-col gap-1.5">
              <span lang={l.code} dir="ltr" className="text-lg font-bold text-ink-lighter truncate">{l.hello}</span>
              <span className="text-sm font-semibold text-ink">{t(`learn.language.${l.id}.name`)}</span>
              <span className="flex items-center justify-between gap-2">
                <span lang={l.code} className="text-xs text-ink-light truncate">{l.native}</span>
                <SoonBadge />
              </span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
