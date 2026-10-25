import { ExternalLink, Sparkles, Star } from 'lucide-react';
import { useTranslation } from '../../i18n/useTranslation';
import { FEATURED_RESOURCES } from '../../data/englishResources';

/** The badge on a recommended tool. */
export function FeaturedBadge() {
  const { t } = useTranslation();
  return (
    <span className="shrink-0 inline-flex items-center gap-1 text-[11px] font-semibold px-1.5 py-0.5 rounded bg-gold-soft/15 text-gold-soft-dark dark:text-gold-soft">
      <Star size={11} className="fill-current" />
      {t('vocabulary.resources.featured.badge')}
    </span>
  );
}

/** The tools we recommend most (Speakozy, YouGlish, NaturalReader), each with a short description. */
export default function RecommendedTools({ className = '' }: { className?: string }) {
  const { t } = useTranslation();
  return (
    <section className={`rounded-2xl border border-gold-soft/40 bg-gold-soft/5 p-4 sm:p-5 space-y-3 ${className}`} aria-labelledby="recommended-tools-title">
      <div>
        <h2 id="recommended-tools-title" className="font-semibold text-ink flex items-center gap-2">
          <Sparkles size={16} className="text-gold-soft" />
          {t('vocabulary.resources.featured.title')}
        </h2>
        <p className="text-xs text-ink-light">{t('vocabulary.resources.featured.hint')}</p>
      </div>
      <ul className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {FEATURED_RESOURCES.map((r) => (
          <li key={r.id} className="rounded-xl border border-border-subtle bg-card p-3 flex flex-col gap-1.5">
            <div className="flex items-start justify-between gap-2">
              <a href={r.url} target="_blank" rel="noopener noreferrer" className="font-semibold text-ink hover:text-clay-soft inline-flex items-center gap-1.5" dir="ltr">
                {r.name}
                <ExternalLink size={13} className="text-ink-lighter" />
              </a>
              <FeaturedBadge />
            </div>
            <p className="text-sm text-ink-light flex-1" dir="auto">{t(`vocabulary.resources.featured.blurb.${r.id}`)}</p>
            <div className="text-[11px] text-ink-lighter truncate" dir="ltr">{new URL(r.url).hostname.replace(/^www\./, '')}</div>
          </li>
        ))}
      </ul>
    </section>
  );
}
