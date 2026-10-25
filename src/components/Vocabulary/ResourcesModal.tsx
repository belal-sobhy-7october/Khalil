import { useEffect, useMemo, useState } from 'react';
import { X, ExternalLink, Star, Compass, Plus, Trash2, Loader2, Clock, Sparkles } from 'lucide-react';
import { useTranslation } from '../../i18n/useTranslation';
import { useAppStore } from '../../store/appStore';
import { ENGLISH_RESOURCES, FEATURED_RESOURCES, RESOURCE_CATEGORIES, type EnglishResource, type ResourceCategory } from '../../data/englishResources';
import {
  addSuggestion,
  deleteSuggestion,
  fetchMySuggestions,
  fetchRatingSummaries,
  normalizeUrl,
  rateResource,
  type RatingSummary,
  type ResourceSuggestion,
} from '../../lib/resourcesApi';
import { useDialog } from '../../lib/useDialog';
import { FeaturedBadge } from '../English/RecommendedTools';

function StarRow({ value, onRate, label }: { value: number; onRate?: (n: number) => void; label: string }) {
  const [hover, setHover] = useState(0);
  const shown = hover || value;
  return (
    <div className="flex items-center" role={onRate ? 'radiogroup' : undefined} aria-label={label} onMouseLeave={() => setHover(0)}>
      {[1, 2, 3, 4, 5].map((n) => {
        const filled = n <= Math.round(shown);
        const icon = <Star size={14} className={filled ? 'fill-yellow-400 text-yellow-400' : 'text-ink-lighter'} />;
        return onRate ? (
          <button
            key={n}
            role="radio"
            aria-checked={value === n}
            aria-label={`${n}`}
            onMouseEnter={() => setHover(n)}
            onClick={() => onRate(n)}
            className="p-[5px]"
          >
            {icon}
          </button>
        ) : (
          <span key={n} className="p-0.5">{icon}</span>
        );
      })}
    </div>
  );
}

export default function ResourcesModal({ onClose }: { onClose: () => void }) {
  const { t } = useTranslation();
  const userId = useAppStore((s) => s.session?.user?.id);

  const [category, setCategory] = useState<ResourceCategory | 'all'>('all');
  // undefined = loading, null = not available (tables missing / offline)
  const [ratings, setRatings] = useState<Map<string, RatingSummary> | null | undefined>(undefined);
  const [suggestions, setSuggestions] = useState<ResourceSuggestion[] | null>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', url: '', description: '', category: '' });
  const [formError, setFormError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    let alive = true;
    void fetchRatingSummaries(userId).then((r) => alive && setRatings(r));
    if (userId) void fetchMySuggestions(userId).then((s) => alive && setSuggestions(s));
    return () => {
      alive = false;
    };
  }, [userId]);

  // "All" opens with the recommended tools on top, so the list below leaves them out.
  const visible = useMemo(
    () => ENGLISH_RESOURCES.filter((r) => (category === 'all' ? !r.featured : r.category === category)),
    [category]
  );

  const handleRate = async (resourceId: string, rating: number) => {
    if (!userId || !ratings) return;
    const previous = ratings;
    // Optimistic: recompute the average with the new personal rating.
    const cur = ratings.get(resourceId) ?? { average: 0, count: 0 };
    const total = cur.average * cur.count - (cur.mine ?? 0) + rating;
    const count = cur.count + (cur.mine ? 0 : 1);
    const next = new Map(ratings);
    next.set(resourceId, { average: total / count, count, mine: rating });
    setRatings(next);
    if (!(await rateResource(resourceId, userId, rating))) setRatings(previous);
  };

  const handleSuggest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;
    const url = normalizeUrl(form.url);
    if (!form.name.trim() || !url) {
      setFormError(t('vocabulary.resources.invalid'));
      return;
    }
    setSending(true);
    setFormError(null);
    const created = await addSuggestion(userId, {
      name: form.name.trim(),
      url,
      description: form.description.trim() || undefined,
      category: form.category || undefined,
    });
    setSending(false);
    if (!created) {
      setFormError(t('vocabulary.resources.sendFailed'));
      return;
    }
    setSuggestions((prev) => [created, ...(prev ?? [])]);
    setForm({ name: '', url: '', description: '', category: '' });
    setShowForm(false);
  };

  const handleDeleteSuggestion = async (id: string) => {
    const previous = suggestions;
    setSuggestions((prev) => prev?.filter((s) => s.id !== id) ?? null);
    if (!(await deleteSuggestion(id))) setSuggestions(previous);
  };

  const categoryLabel = (c: ResourceCategory) => t(`vocabulary.resources.cat.${c}`);
  const inputClass =
    'w-full px-3 py-2 bg-ink/5 border border-border-subtle rounded-lg text-ink text-sm placeholder:text-ink-lighter focus:outline-none focus:border-clay-soft';

  const dialog = useDialog(onClose);

  const renderCard = (r: EnglishResource, featured = false) => {
    const summary = ratings?.get(r.id);
    return (
      <div key={r.id} className={`p-4 rounded-xl border flex flex-col gap-2 ${featured ? 'border-gold-soft/50 bg-gold-soft/5' : 'border-border-subtle'}`} dir="ltr">
        {/* The badges drop under the name when the card is narrow, instead of covering it. */}
        <div className="flex flex-wrap items-start justify-between gap-2">
          <a
            href={r.url}
            target="_blank"
            rel="noopener noreferrer"
            className="min-w-0 font-semibold text-ink hover:text-clay-soft flex items-center gap-1.5"
          >
            {r.name}
            <ExternalLink size={13} className="text-ink-lighter" />
          </a>
          <span className="flex flex-wrap gap-1">
            {featured && <FeaturedBadge />}
            <span className="text-[11px] px-1.5 py-0.5 rounded bg-ink/5 text-ink-light" dir="auto">
              {categoryLabel(r.category)} · {t(`vocabulary.resources.${r.free === true ? 'free' : r.free === 'freemium' ? 'freemium' : 'paid'}`)}
            </span>
          </span>
        </div>
        {/* The recommended tools have a description in the app's language too. */}
        <p className="text-sm text-ink-light flex-1" dir="auto">{featured ? t(`vocabulary.resources.featured.blurb.${r.id}`) : r.description}</p>
        <div className="text-[11px] text-ink-lighter truncate">{new URL(r.url).hostname.replace(/^www\./, '')}</div>
        {ratings !== null && (
          <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-border-subtle">
            <div className="flex items-center gap-1.5 text-xs text-ink-light">
              <StarRow value={summary?.average ?? 0} label={t('vocabulary.resources.average')} />
              {ratings === undefined ? (
                <Loader2 size={12} className="animate-spin" />
              ) : summary ? (
                <span className="tabular-nums">{summary.average.toFixed(1)} ({summary.count})</span>
              ) : (
                <span dir="auto">{t('vocabulary.resources.noRatings')}</span>
              )}
            </div>
            {ratings && userId && (
              <div className="flex items-center gap-1 text-xs text-ink-light">
                <span dir="auto">{t('vocabulary.resources.yourRating')}</span>
                <StarRow
                  value={summary?.mine ?? 0}
                  onRate={(n) => void handleRate(r.id, n)}
                  label={`${t('vocabulary.resources.yourRating')} ${r.name}`}
                />
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-ink/50 flex items-center justify-center z-50 p-4" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div {...dialog.props} className="bg-card border border-border-subtle rounded-2xl w-full max-w-4xl max-h-[90svh] overflow-hidden flex flex-col">
        <div className="px-6 py-4 border-b border-border-subtle flex items-center justify-between">
          <div>
            <h2 id={dialog.titleId} className="text-xl font-bold text-ink flex items-center gap-2">
              <Compass size={20} className="text-clay-soft" />
              {t('vocabulary.resources.title')}
            </h2>
            <p className="text-xs text-ink-light mt-0.5">{t('vocabulary.resources.subtitle')}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-ink/5 rounded-lg transition-colors" aria-label={t('common.close')}>
            <X size={20} className="text-ink-light" />
          </button>
        </div>

        <div className="shrink-0 px-6 pt-4 flex gap-2 overflow-x-auto pb-1">
          {(['all', ...RESOURCE_CATEGORIES] as const).map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`shrink-0 px-3 py-1 rounded-full text-sm border transition-colors ${
                category === c ? 'bg-clay-soft text-white border-clay-soft' : 'border-border-subtle text-ink hover:bg-ink/5'
              }`}
            >
              {c === 'all' ? t('vocabulary.allTopics') : categoryLabel(c)}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {category === 'all' && (
            <section className="space-y-3" aria-labelledby="featured-resources-title">
              <div>
                <h3 id="featured-resources-title" className="font-semibold text-ink flex items-center gap-2">
                  <Sparkles size={16} className="text-gold-soft" />
                  {t('vocabulary.resources.featured.title')}
                </h3>
                <p className="text-xs text-ink-light">{t('vocabulary.resources.featured.hint')}</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">{FEATURED_RESOURCES.map((r) => renderCard(r, true))}</div>
            </section>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {visible.map((r) => renderCard(r, !!r.featured))}
          </div>

          {ratings === null && (
            <p className="text-xs text-ink-lighter text-center">{t('vocabulary.resources.unavailable')}</p>
          )}

          {/* Suggestions */}
          {suggestions !== null && (
            <div className="rounded-xl border border-dashed border-border-subtle p-4 space-y-3">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <p className="text-sm font-medium text-ink">{t('vocabulary.resources.suggestTitle')}</p>
                  <p className="text-xs text-ink-light">{t('vocabulary.resources.suggestHint')}</p>
                </div>
                {!showForm && (
                  <button
                    onClick={() => setShowForm(true)}
                    className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-lg bg-clay-soft text-white hover:bg-clay-soft-dark transition-colors"
                  >
                    <Plus size={14} />
                    {t('vocabulary.resources.suggest')}
                  </button>
                )}
              </div>

              {showForm && (
                <form onSubmit={handleSuggest} className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <input
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder={t('vocabulary.resources.namePlaceholder')}
                    maxLength={100}
                    className={inputClass}
                    dir="auto"
                  />
                  <input
                    value={form.url}
                    onChange={(e) => setForm({ ...form, url: e.target.value })}
                    placeholder="https://…"
                    maxLength={500}
                    className={inputClass}
                    dir="ltr"
                  />
                  <textarea
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    placeholder={t('vocabulary.resources.descPlaceholder')}
                    maxLength={500}
                    rows={2}
                    className={`${inputClass} md:col-span-2 resize-none`}
                    dir="auto"
                  />
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className={inputClass}
                  >
                    <option value="">{t('vocabulary.resources.categoryPlaceholder')}</option>
                    {RESOURCE_CATEGORIES.map((c) => (
                      <option key={c} value={c}>{categoryLabel(c)}</option>
                    ))}
                  </select>
                  <div className="flex gap-2 justify-end">
                    <button
                      type="button"
                      onClick={() => { setShowForm(false); setFormError(null); }}
                      className="px-3 py-2 text-sm rounded-lg bg-ink/5 text-ink hover:bg-ink/10"
                    >
                      {t('common.cancel')}
                    </button>
                    <button
                      type="submit"
                      disabled={sending}
                      className="flex items-center gap-1.5 px-3 py-2 text-sm rounded-lg bg-clay-soft text-white hover:bg-clay-soft-dark disabled:opacity-40"
                    >
                      {sending && <Loader2 size={14} className="animate-spin" />}
                      {t('vocabulary.resources.send')}
                    </button>
                  </div>
                  {formError && <p className="md:col-span-2 text-xs text-red-500">{formError}</p>}
                </form>
              )}

              {suggestions.length > 0 && (
                <ul className="space-y-1.5">
                  {suggestions.map((s) => (
                    <li key={s.id} className="flex items-center gap-2 text-sm">
                      <Clock size={13} className="text-ink-lighter shrink-0" />
                      <a href={s.url} target="_blank" rel="noopener noreferrer" className="text-ink hover:text-clay-soft truncate" dir="auto">
                        {s.name}
                      </a>
                      <span className="text-[11px] px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 shrink-0">
                        {t('vocabulary.resources.pending')}
                      </span>
                      <button
                        onClick={() => void handleDeleteSuggestion(s.id)}
                        className="ms-auto p-1 text-ink-lighter hover:text-red-500"
                        aria-label={`${t('common.delete')}: ${s.name}`}
                      >
                        <Trash2 size={13} />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
